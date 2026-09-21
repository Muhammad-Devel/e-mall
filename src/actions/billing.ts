"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import type { ActionResult } from "./auth";

const DEFAULT_PLANS = [
  { code: "STARTER", name: "Starter", description: "Asosiy savdo va POS imkoniyatlari", monthlyPrice: 0, features: ["POS", "Mahsulotlar", "Ombor"] },
  { code: "PRO", name: "Pro", description: "Kengaytirilgan boshqaruv va premium imkoniyatlar", monthlyPrice: 0, features: ["Starter imkoniyatlari", "Hisobotlar", "Premium funksiyalar"] },
];

export async function ensureBillingPlans() {
  for (const plan of DEFAULT_PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: { name: plan.name, description: plan.description, features: plan.features },
      create: { ...plan },
    });
  }
  return prisma.subscriptionPlan.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } });
}

export async function getAllBillingPlans() {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.subscriptionPlan.findMany({ orderBy: { createdAt: "asc" } });
}

export async function activateDemoSubscription(planId: string): Promise<ActionResult> {
  const session = await requireRole(["OWNER"]);
  const storeId = session.user.storeId;
  if (!storeId) return { ok: false, error: "Do'kon topilmadi" };

  const plan = await prisma.subscriptionPlan.findFirst({ where: { id: planId, active: true } });
  if (!plan) return { ok: false, error: "Tarif topilmadi" };

  const startsAt = new Date();
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 30);

  await prisma.$transaction(async (tx) => {
    await tx.storeSubscription.updateMany({
      where: { storeId, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    });
    const subscription = await tx.storeSubscription.create({
      data: { storeId, planId: plan.id, status: "ACTIVE", startsAt, endsAt, autoRenew: false },
    });
    await tx.billingPayment.create({
      data: {
        storeId,
        planId: plan.id,
        subscriptionId: subscription.id,
        provider: "DEMO",
        status: "PAID",
        amount: plan.monthlyPrice,
        providerTxId: `demo_${subscription.id}`,
        metadata: { mode: "test" },
        paidAt: startsAt,
      },
    });
  });

  revalidatePath("/dashboard/owner/billing");
  return { ok: true, data: undefined };
}
