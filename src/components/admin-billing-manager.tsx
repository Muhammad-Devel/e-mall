"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Pencil, Power, Receipt } from "lucide-react";
import { updateSubscriptionPlan, toggleSubscriptionPlan } from "@/actions/admin-billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTime, formatSom } from "@/lib/format";

type Plan = { id: string; code: string; name: string; description: string | null; monthlyPrice: number; active: boolean };
type Subscription = { id: string; storeName: string; planName: string; status: string; endsAt: string };
type Payment = { id: string; storeName: string; planName: string; amount: number; status: string; provider: string; createdAt: string };

export function AdminBillingManager({
  plans,
  subscriptions,
  payments,
}: {
  plans: Plan[];
  subscriptions: Subscription[];
  payments: Payment[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Plan | null>(null);

  function savePlan(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateSubscriptionPlan(editing.id, {
        name: formData.get("name"),
        description: formData.get("description"),
        monthlyPrice: formData.get("monthlyPrice"),
      });
      if (result.ok) {
        toast.success("Tarif yangilandi");
        setEditing(null);
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function togglePlan(id: string) {
    startTransition(async () => {
      const result = await toggleSubscriptionPlan(id);
      if (result.ok) {
        toast.success("Tarif holati yangilandi");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Billing boshqaruvi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tariflar, do&apos;kon obunalari va test to&apos;lovlarini boshqaring.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div><CardTitle>{plan.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{plan.code}</p></div>
              <Badge variant={plan.active ? "success" : "destructive"}>{plan.active ? "Faol" : "Nofaol"}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-bold">{plan.monthlyPrice ? `${formatSom(plan.monthlyPrice)} so&apos;m` : "Narx belgilanmagan"}</p>
              <p className="text-sm text-muted-foreground">{plan.description ?? "Tavsif kiritilmagan"}</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditing(plan)}><Pencil className="size-4" />Tahrirlash</Button>
                <Button type="button" size="sm" variant={plan.active ? "destructive" : "success"} disabled={pending} onClick={() => togglePlan(plan.id)}><Power className="size-4" />{plan.active ? "O&apos;chirish" : "Yoqish"}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="size-4" />Do&apos;kon obunalari ({subscriptions.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {subscriptions.length === 0 ? <p className="text-sm text-muted-foreground">Hozircha obunalar mavjud emas.</p> : subscriptions.map((subscription) => (
            <div key={subscription.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 p-3 text-sm">
              <div><p className="font-medium">{subscription.storeName} · {subscription.planName}</p><p className="text-xs text-muted-foreground">Muddati: {formatDateTime(subscription.endsAt)}</p></div>
              <Badge variant={subscription.status === "ACTIVE" ? "success" : "warning"}>{subscription.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="size-4" />To&apos;lovlar ({payments.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {payments.length === 0 ? <p className="text-sm text-muted-foreground">Hozircha to&apos;lovlar mavjud emas.</p> : payments.map((payment) => (
            <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 p-3 text-sm">
              <div><p className="font-medium">{payment.storeName} · {payment.planName}</p><p className="text-xs text-muted-foreground">{payment.provider} · {formatDateTime(payment.createdAt)}</p></div>
              <div className="text-right"><p className="font-semibold">{payment.amount ? `${formatSom(payment.amount)} so&apos;m` : "Test"}</p><Badge variant={payment.status === "PAID" ? "success" : "warning"}>{payment.status}</Badge></div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tarifni tahrirlash</DialogTitle></DialogHeader>
          {editing && <form action={savePlan} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="plan-name">Tarif nomi</Label><Input id="plan-name" name="name" defaultValue={editing.name} required /></div>
            <div className="space-y-2"><Label htmlFor="plan-description">Tavsif</Label><Input id="plan-description" name="description" defaultValue={editing.description ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="plan-price">Oylik narx (so&apos;m)</Label><Input id="plan-price" name="monthlyPrice" type="number" min="0" step="1" defaultValue={editing.monthlyPrice} required /></div>
            <DialogFooter><Button type="submit" disabled={pending}><CreditCard className="size-4" />Saqlash</Button></DialogFooter>
          </form>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
