import { prisma } from "@/lib/prisma";
import { StoreStatusActions } from "@/components/store-status-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatSom } from "@/lib/format";
import { CalendarDays, MapPin, Package, ShoppingCart, Store as StoreIcon, Users } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Kutilmoqda",
  ACTIVE: "Faol",
  SUSPENDED: "Bloklangan",
};

export default async function AdminStoresPage() {
  const [stores, salesSummary] = await Promise.all([
    prisma.store.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { fullName: true, phone: true } },
        storeTypes: { select: { name: true } },
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { plan: { select: { name: true } } },
        },
        _count: { select: { users: true, products: true, orders: true } },
      },
    }),
    prisma.sale.groupBy({
      by: ["storeId"],
      _count: { _all: true },
      _sum: { total: true },
      _max: { createdAt: true },
    }),
  ]);
  const salesByStore = new Map(salesSummary.map((summary) => [summary.storeId, summary]));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Do&apos;konlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Barcha do&apos;konlar, egalari va faoliyat ko&apos;rsatkichlarini boshqaring.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {stores.map((store) => (
          (() => {
            const sales = salesByStore.get(store.id);
            const subscription = store.subscriptions[0];
            return (
          <Card key={store.id} className="overflow-hidden border-0 bg-gradient-to-br from-card via-card to-brand/5 shadow-sm ring-1 ring-foreground/10">
            <div className="h-1 bg-brand" />
            <CardHeader className="gap-4 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                    {store.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.logoUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <StoreIcon className="size-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{store.name}</CardTitle>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      <span data-no-transliterate>{store.slug}</span>
                    </p>
                  </div>
                </div>
                <Badge
                  variant={store.status === "ACTIVE" ? "success" : store.status === "SUSPENDED" ? "destructive" : "warning"}
                >
                  {STATUS_LABEL[store.status]}
                </Badge>
              </div>
              <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <p className="flex items-center gap-1.5"><Users className="size-3.5 shrink-0" />{store.owner.fullName} · {store.owner.phone}</p>
                <p className="flex items-center gap-1.5"><CalendarDays className="size-3.5 shrink-0" />Qo&apos;shilgan: {formatDateTime(store.createdAt)}</p>
                <p className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0" />{store.address ?? "Manzil kiritilmagan"}</p>
                <p className="flex items-center gap-1.5"><StoreIcon className="size-3.5 shrink-0" />{store.storeTypes.map((type) => type.name).join(", ") || "Do'kon turi belgilanmagan"}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-blue-500/10 p-3"><div className="flex items-center gap-1 text-xs text-muted-foreground"><Package className="size-3.5 text-blue-600" />Mahsulot</div><p className="mt-1 text-lg font-semibold text-blue-700">{store._count.products}</p></div>
                <div className="rounded-xl bg-violet-500/10 p-3"><div className="flex items-center gap-1 text-xs text-muted-foreground"><ShoppingCart className="size-3.5 text-violet-600" />Buyurtma</div><p className="mt-1 text-lg font-semibold text-violet-700">{store._count.orders}</p></div>
                <div className="rounded-xl bg-emerald-500/10 p-3"><div className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="size-3.5 text-emerald-600" />Xodim</div><p className="mt-1 text-lg font-semibold text-emerald-700">{store._count.users}</p></div>
              </div>
              <div className="grid gap-2 rounded-xl bg-muted/40 p-3 text-xs sm:grid-cols-2">
                <p><span className="text-muted-foreground">Jami savdo:</span> <span className="font-semibold">{formatSom(sales?._sum.total?.toString() ?? 0)} so&apos;m</span></p>
                <p><span className="text-muted-foreground">Savdolar soni:</span> <span className="font-semibold">{sales?._count._all ?? 0} ta</span></p>
                <p><span className="text-muted-foreground">Oxirgi savdo:</span> <span className="font-semibold">{sales?._max.createdAt ? formatDateTime(sales._max.createdAt) : "Hali savdo yo'q"}</span></p>
                <p><span className="text-muted-foreground">Obuna:</span> <span className="font-semibold">{subscription?.status === "ACTIVE" ? `${subscription.plan.name} · Faol` : "Faol emas"}</span></p>
              </div>
              <StoreStatusActions storeId={store.id} status={store.status} />
            </CardContent>
          </Card>
            );
          })()
        ))}

        {stores.length === 0 && <p className="text-sm text-muted-foreground">Hozircha do&apos;konlar yo&apos;q.</p>}
      </div>
    </div>
  );
}
