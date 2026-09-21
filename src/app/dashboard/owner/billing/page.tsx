import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureBillingPlans } from "@/actions/billing";
import { BillingManager } from "@/components/billing-manager";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.storeId || session.user.role !== "OWNER") redirect("/login");

  const plans = await ensureBillingPlans();
  const subscription = await prisma.storeSubscription.findFirst({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: "desc" },
    include: { plan: { select: { name: true, code: true } } },
  });
  const payments = await prisma.billingPayment.findMany({
    where: { storeId: session.user.storeId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { plan: { select: { name: true } } },
  });

  return (
    <BillingManager
      plans={plans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        description: plan.description,
        monthlyPrice: Number(plan.monthlyPrice),
        features: Array.isArray(plan.features) ? plan.features.map(String) : [],
      }))}
      subscription={subscription ? {
        planName: subscription.plan.name,
        status: subscription.status,
        endsAt: subscription.endsAt.toISOString(),
      } : null}
      payments={payments.map((payment) => ({
        id: payment.id,
        planName: payment.plan.name,
        amount: Number(payment.amount),
        status: payment.status,
        provider: payment.provider,
        createdAt: payment.createdAt.toISOString(),
      }))}
    />
  );
}
