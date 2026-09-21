import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureBillingPlans, getAllBillingPlans } from "@/actions/billing";
import { AdminBillingManager } from "@/components/admin-billing-manager";

export default async function AdminBillingPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/login");

  await ensureBillingPlans();
  const plans = await getAllBillingPlans();
  const [subscriptions, payments] = await Promise.all([
    prisma.storeSubscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { store: { select: { name: true } }, plan: { select: { name: true } } },
    }),
    prisma.billingPayment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { store: { select: { name: true } }, plan: { select: { name: true } } },
    }),
  ]);

  return (
    <AdminBillingManager
      plans={plans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        description: plan.description,
        monthlyPrice: Number(plan.monthlyPrice),
        active: plan.active,
      }))}
      subscriptions={subscriptions.map((subscription) => ({
        id: subscription.id,
        storeName: subscription.store.name,
        planName: subscription.plan.name,
        status: subscription.status,
        endsAt: subscription.endsAt.toISOString(),
      }))}
      payments={payments.map((payment) => ({
        id: payment.id,
        storeName: payment.store.name,
        planName: payment.plan.name,
        amount: Number(payment.amount),
        status: payment.status,
        provider: payment.provider,
        createdAt: payment.createdAt.toISOString(),
      }))}
    />
  );
}
