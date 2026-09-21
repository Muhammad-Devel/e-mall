"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, CreditCard, History, ShieldCheck } from "lucide-react";
import { activateDemoSubscription } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatSom } from "@/lib/format";

type Plan = { id: string; code: string; name: string; description: string | null; monthlyPrice: number; features: string[] };
type Subscription = { planName: string; status: string; endsAt: string } | null;
type Payment = { id: string; planName: string; amount: number; status: string; provider: string; createdAt: string };

export function BillingManager({ plans, subscription, payments }: { plans: Plan[]; subscription: Subscription; payments: Payment[] }) {
  const [pending, startTransition] = useTransition();
  function activate(planId: string) {
    startTransition(async () => {
      const result = await activateDemoSubscription(planId);
      if (result.ok) toast.success("Test obuna faollashtirildi");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Obuna va to&apos;lovlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hozircha test rejimi. Click va Payme integratsiyasi keyingi bosqichda ulanadi.</p>
      </div>
      {subscription && (
        <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3"><ShieldCheck className="size-5 text-emerald-600" /><div><p className="font-semibold">{subscription.planName} tarifi faol</p><p className="text-sm text-muted-foreground">Amal qilish muddati: {formatDateTime(subscription.endsAt)}</p></div></div>
            <Badge variant="success">Faol</Badge>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden">
            {plan.code === "PRO" && <div className="absolute right-4 top-4"><Badge variant="info">Premium</Badge></div>}
            <CardHeader><CardTitle>{plan.name}</CardTitle><CardDescription>{plan.description}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-2xl font-bold">{plan.monthlyPrice ? `${formatSom(plan.monthlyPrice)} so'm` : "Narx keyin belgilanadi"}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check className="size-4 text-emerald-600" />{feature}</li>)}</ul>
              <Button type="button" variant="success" className="w-full" disabled={pending} onClick={() => activate(plan.id)}><CreditCard className="size-4" />Test obunani faollashtirish</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="size-4" />To&apos;lovlar tarixi</CardTitle></CardHeader>
        <CardContent>{payments.length === 0 ? <p className="text-sm text-muted-foreground">Hozircha to&apos;lovlar mavjud emas.</p> : <div className="space-y-3">{payments.map((payment) => <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 p-3 text-sm"><div><p className="font-medium">{payment.planName} · {payment.provider}</p><p className="text-xs text-muted-foreground">{formatDateTime(payment.createdAt)}</p></div><div className="text-right"><p className="font-semibold">{payment.amount ? `${formatSom(payment.amount)} so'm` : "Test"}</p><Badge variant={payment.status === "PAID" ? "success" : "warning"}>{payment.status === "PAID" ? "To'langan" : payment.status}</Badge></div></div>)}</div>}</CardContent>
      </Card>
    </div>
  );
}
