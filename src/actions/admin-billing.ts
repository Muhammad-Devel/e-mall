"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import type { ActionResult } from "./auth";

export async function updateSubscriptionPlan(
  planId: string,
  input: { name: unknown; description: unknown; monthlyPrice: unknown }
): Promise<ActionResult> {
  await requireRole(["SUPER_ADMIN"]);
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() || null : null;
  const monthlyPrice = Number(input.monthlyPrice);
  if (!name) return { ok: false, error: "Tarif nomini kiriting" };
  if (!Number.isFinite(monthlyPrice) || monthlyPrice < 0) return { ok: false, error: "Tarif narxi noto'g'ri" };

  await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: { name, description, monthlyPrice },
  });
  revalidatePath("/dashboard/admin/billing");
  revalidatePath("/dashboard/owner/billing");
  return { ok: true, data: undefined };
}

export async function toggleSubscriptionPlan(planId: string): Promise<ActionResult> {
  await requireRole(["SUPER_ADMIN"]);
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId }, select: { active: true } });
  if (!plan) return { ok: false, error: "Tarif topilmadi" };
  await prisma.subscriptionPlan.update({ where: { id: planId }, data: { active: !plan.active } });
  revalidatePath("/dashboard/admin/billing");
  revalidatePath("/dashboard/owner/billing");
  return { ok: true, data: undefined };
}
