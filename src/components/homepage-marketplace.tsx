"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  MapPin,
  PackageSearch,
  Search,
  ShoppingBag,
  Sparkles,
  Store as StoreIcon,
  Truck,
  Users,
} from "lucide-react";
import { DiscoveryGrid, type DiscoveryItem } from "@/components/discovery-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSom } from "@/lib/format";

type HomepageProduct = {
  id: string;
  name: string;
  size: string | null;
  imageUrl: string | null;
  price: number;
  discountPrice: number | null;
  discountEndsAt: string | null;
  stock: number;
  storeName: string;
  storeSlug: string;
};

type HomepageStore = DiscoveryItem & {
  storeTypes: string[];
  productCount: number;
  orderCount: number;
};

type HomepageCategory = { id: string; name: string; imageUrl: string | null; productCount: number };

function isDiscountActive(product: HomepageProduct) {
  return product.discountPrice != null && product.discountEndsAt != null && new Date(product.discountEndsAt).getTime() > Date.now();
}

export function HomepageMarketplace({
  products,
  categories,
  stores,
  cafes,
  appUrl,
}: {
  products: HomepageProduct[];
  categories: HomepageCategory[];
  stores: HomepageStore[];
  cafes: DiscoveryItem[];
  appUrl: string;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = useMemo(
    () =>
      normalizedQuery
        ? products.filter((product) =>
            [product.name, product.storeName, product.size ?? ""].join(" ").toLowerCase().includes(normalizedQuery)
          )
        : products,
    [normalizedQuery, products]
  );

  return (
    <div className="min-h-full overflow-x-hidden bg-background">
      <main className="pb-24 sm:pb-10">
        <section className="px-4 pt-4 sm:pt-6">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-5 py-10 text-white shadow-xl shadow-brand/15 sm:px-10 sm:py-14 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-indigo-950/40 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-10 hidden rotate-6 gap-3 lg:flex">
              <div className="w-40 rounded-2xl bg-white/10 p-3 shadow-2xl ring-1 ring-white/20 backdrop-blur">
                <div className="mb-3 h-20 rounded-xl bg-white/15" />
                <div className="h-2 w-24 rounded-full bg-white/60" />
                <div className="mt-2 h-2 w-16 rounded-full bg-white/30" />
              </div>
              <div className="mt-14 w-36 -rotate-6 rounded-2xl bg-white p-3 text-brand shadow-2xl">
                <ShoppingBag className="size-6" />
                <p className="mt-8 text-xs font-bold">Mahalliy savdo</p>
                <p className="mt-1 text-[11px] text-brand/70">Bir joyda</p>
              </div>
            </div>
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                <Sparkles className="size-3.5" />
                Mahalliy commerce ekotizimi
              </span>
              <h1 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
                Kerakli mahsulot va xizmatlar — bir joyda.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Yaqin do&apos;konlarni toping, mahsulotlarni solishtiring va ishonchli mahalliy bizneslardan xarid qiling.
              </p>
              <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-1.5 shadow-2xl">
                <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Mahsulot yoki do'kon qidiring..."
                  aria-label="Mahsulot yoki do'kon qidirish"
                  className="h-11 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                />
                <Button type="button" size="lg" className="hidden shrink-0 sm:inline-flex" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                  Qidirish
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/75">
                <span className="flex items-center gap-2"><CheckCircle2 className="size-4" />Tasdiqlangan do&apos;konlar</span>
                <span className="flex items-center gap-2"><MapPin className="size-4" />Yaqin atrofda qidiring</span>
                <span className="flex items-center gap-2"><Truck className="size-4" />Qulay buyurtma</span>
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pt-10" aria-labelledby="categories-title">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-sm font-medium text-brand">Tezkor tanlov</p><h2 id="categories-title" className="mt-1 text-2xl font-bold">Kategoriyalar</h2></div>
            </div>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button key={category.id} type="button" onClick={() => { setQuery(category.name); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} className="group flex min-w-28 flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-md">
                  <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl bg-brand/8 text-brand">
                    {category.imageUrl ? <img src={category.imageUrl} alt="" className="size-full object-cover" /> : <PackageSearch className="size-6" />}
                  </div>
                  <span className="line-clamp-2 text-xs font-semibold">{category.name}</span>
                  <span className="text-[11px] text-muted-foreground">{category.productCount} mahsulot</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section id="products" className="mx-auto max-w-7xl px-4 pt-12" aria-labelledby="products-title">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-medium text-brand">Tanlangan mahsulotlar</p><h2 id="products-title" className="mt-1 text-2xl font-bold">Mashhur mahsulotlar</h2></div>
            {visibleProducts.length > 0 && <span className="text-sm text-muted-foreground">{visibleProducts.length} ta mahsulot</span>}
          </div>
          {visibleProducts.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed px-5 py-16 text-center"><PackageSearch className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-semibold">{query ? "Mahsulot topilmadi" : "Hozircha mahsulotlar mavjud emas"}</p><p className="mt-1 text-sm text-muted-foreground">Faol do&apos;konlar mahsulot qo&apos;shganda shu yerda ko&apos;rinadi.</p></div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.slice(0, 12).map((product) => {
                const discounted = isDiscountActive(product);
                const currentPrice = discounted ? product.discountPrice! : product.price;
                return (
                  <Link key={product.id} href={`/store/${product.storeSlug}`} className="group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/8">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center text-muted-foreground"><PackageSearch className="size-8" /></div>}
                      {discounted && <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-[10px] font-bold text-white">Chegirma</span>}
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="line-clamp-2 min-h-10 text-sm font-semibold">{product.name}{product.size ? `, ${product.size}` : ""}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground"><StoreIcon className="size-3.5 shrink-0" />{product.storeName}</p>
                      <div><p className="text-base font-bold text-brand">{formatSom(currentPrice)} so&apos;m</p>{discounted && <p className="text-xs text-muted-foreground line-through">{formatSom(product.price)} so&apos;m</p>}</div>
                      <p className="text-[11px] text-emerald-600">Mavjud: {product.stock} {product.stock === 1 ? "dona" : "dona"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {stores.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="stores-title">
            <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-brand">Ishonchli hamkorlar</p><h2 id="stores-title" className="mt-1 text-2xl font-bold">Mashhur do&apos;konlar</h2></div><Link href="#discover" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">Barchasini ko&apos;rish <ArrowRight className="size-4" /></Link></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.slice(0, 6).map((store) => (
                <Link key={store.id} href={`/store/${store.slug}`} className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand/8 text-brand">{store.logoUrl ? <img src={store.logoUrl} alt="" className="size-full object-cover" /> : <Building2 className="size-7" />}</div>
                  <div className="min-w-0 flex-1"><p className="flex items-center gap-1 truncate font-bold">{store.name}<BadgeCheck className="size-4 shrink-0 text-brand" /></p><p className="mt-1 truncate text-xs text-muted-foreground">{store.storeTypes.join(", ") || "Mahalliy do&apos;kon"}</p><p className="mt-2 text-xs text-muted-foreground">{store.productCount} mahsulot · {store.orderCount} buyurtma</p></div><ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" /></Link>
              ))}
            </div>
          </section>
        )}

        <section id="discover" className="mx-auto max-w-7xl px-4 pt-14" aria-labelledby="discover-title">
          <div className="mb-5"><p className="text-sm font-medium text-brand">Hududingizdagi savdo</p><h2 id="discover-title" className="mt-1 text-2xl font-bold">Yaqin do&apos;konlar va kafelar</h2></div>
          <DiscoveryGrid stores={stores} cafes={cafes} />
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-14">
          <div className="rounded-[2rem] border bg-muted/30 p-6 sm:p-10">
            <div className="grid gap-8 md:grid-cols-4">
              {[
                [StoreIcon, "Mahalliy bizneslar", "Yaqin do‘kon va xizmatlarni bir joydan toping."],
                [Search, "Oson qidiruv", "Mahsulotni nomi yoki do‘koni bo‘yicha tez toping."],
                [CheckCircle2, "Ishonchli savdo", "Tasdiqlangan do‘konlar va aniq ma’lumotlar."],
                [Users, "Biznes uchun", "Savdo, mahsulot va mijozlarni bitta panelda boshqaring."],
              ].map(([Icon, title, description]) => {
                const FeatureIcon = Icon as typeof StoreIcon;
                return <div key={String(title)}><div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><FeatureIcon className="size-5" /></div><h3 className="mt-4 font-bold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{String(description)}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-9 text-background sm:px-10">
            <div className="absolute -right-16 -top-20 size-64 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div><p className="text-sm font-medium text-brand">Biznesingizni rivojlantiring</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Biznesingizni E-MALL.UZ&apos;ga olib chiqing.</h2><p className="mt-2 max-w-xl text-sm text-background/65">Mahsulotlaringizni ko&apos;proq mijozlarga ko&apos;rsating va savdolaringizni qulay boshqaring.</p></div>
              <Button render={<Link href={`${appUrl}/register`} />} nativeButton={false} size="lg" className="shrink-0 bg-brand text-white hover:bg-brand/90">Biznes uchun boshlash <ArrowRight className="size-4" /></Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
