"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Phone, Plus, ShoppingBag, Trash2, TrendingUp, UserRound } from "lucide-react";
import { inviteSeller, removeSeller } from "@/actions/sellers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatSom } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Seller = {
  id: string;
  fullName: string;
  phone: string;
  createdAt: string;
  saleCount: number;
  totalSales: number;
  lastSaleAt: string | null;
};

export function SellerManager({ initialSellers }: { initialSellers: Seller[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleInvite(formData: FormData) {
    startTransition(async () => {
      const result = await inviteSeller({
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      });
      if (result.ok) {
        toast.success("Sotuvchi qo'shildi");
        setOpen(false);
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      const result = await removeSeller(id);
      if (result.ok) {
        toast.success("Sotuvchi o'chirildi");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sotuvchilar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="size-4" /> Sotuvchi qo&apos;shish
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi sotuvchi</DialogTitle>
            </DialogHeader>
            <form action={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">To&apos;liq ismi</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqam</Label>
                <PhoneInput checkAvailability />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Vaqtinchalik parol</Label>
                <Input id="password" name="password" type="password" minLength={6} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  Qo&apos;shish
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {initialSellers.map((s) => (
          <Card key={s.id} className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-brand/5 shadow-sm ring-1 ring-brand/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-brand" />
            <CardHeader className="flex-row items-start justify-between gap-3 pb-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <UserRound className="size-6" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{s.fullName}</CardTitle>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="size-3.5" />
                    {s.phone}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() => handleRemove(s.id)}
                className="shrink-0"
              >
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">O&apos;chirish</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="size-3.5 text-emerald-600" />
                    Jami savdo
                  </div>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">{formatSom(s.totalSales)} so&apos;m</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShoppingBag className="size-3.5 text-blue-600" />
                    Savdolar soni
                  </div>
                  <p className="mt-1 text-sm font-semibold text-blue-700">{s.saleCount} ta</p>
                </div>
              </div>
              <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 shrink-0" />
                  Qo&apos;shilgan: {formatDateTime(s.createdAt)}
                </p>
                <p className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 shrink-0" />
                  Oxirgi savdo: {s.lastSaleAt ? formatDateTime(s.lastSaleAt) : "Hali savdo qilmagan"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {initialSellers.length === 0 && (
          <CardContent className="text-sm text-muted-foreground">Hozircha sotuvchilar yo&apos;q.</CardContent>
        )}
      </div>
    </div>
  );
}
