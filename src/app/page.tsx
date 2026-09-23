import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { appOrigin } from "@/lib/domain";
import { fetchActiveCafes } from "@/lib/ecafe";
import { HomepageMarketplace } from "@/components/homepage-marketplace";

export default async function HomePage() {
  const host = (await headers()).get("host") ?? "";
  const appUrl = appOrigin(host);

  const [stores, cafes, products, categories] = await Promise.all([
    prisma.store.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        latitude: true,
        longitude: true,
        serviceRadiusKm: true,
        servicePolygon: true,
        storeTypes: { select: { name: true } },
        _count: { select: { products: true, orders: true } },
      },
    }),
    fetchActiveCafes(),
    prisma.product.findMany({
      where: { store: { status: "ACTIVE" }, isPublished: true, stock: { gt: 0 } },
      orderBy: [{ isNew: "desc" }, { createdAt: "desc" }],
      take: 24,
      select: {
        id: true,
        price: true,
        stock: true,
        discountPrice: true,
        discountEndsAt: true,
        catalogProduct: { select: { name: true, size: true, imageUrl: true } },
        store: { select: { name: true, slug: true } },
      },
    }),
    prisma.category.findMany({
      where: { catalogProducts: { some: { products: { some: { store: { status: "ACTIVE" }, isPublished: true, stock: { gt: 0 } } } } } },
      orderBy: { name: "asc" },
      take: 12,
      select: { id: true, name: true, imageUrl: true, _count: { select: { catalogProducts: true } } },
    }),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <HomepageMarketplace
        appUrl={appUrl}
        cafes={cafes.map((cafe) => ({
          id: cafe.id,
          name: cafe.name,
          slug: cafe.slug,
          description: cafe.description,
          logoUrl: cafe.logoUrl,
          bannerUrl: cafe.bannerUrl,
          latitude: cafe.latitude,
          longitude: cafe.longitude,
          serviceRadiusKm: cafe.serviceRadiusKm,
          servicePolygon: cafe.servicePolygon,
          href: `/cafe/${cafe.slug}`,
        }))}
        stores={stores.map((store) => ({
          id: store.id,
          name: store.name,
          slug: store.slug,
          description: store.description,
          logoUrl: store.logoUrl,
          bannerUrl: store.bannerUrl,
          latitude: store.latitude,
          longitude: store.longitude,
          serviceRadiusKm: store.serviceRadiusKm,
          servicePolygon: store.servicePolygon as { lat: number; lng: number }[] | null,
          href: `/store/${store.slug}`,
          storeTypes: store.storeTypes.map((type) => type.name),
          productCount: store._count.products,
          orderCount: store._count.orders,
        }))}
        products={products.map((product) => ({
          id: product.id,
          name: product.catalogProduct.name,
          size: product.catalogProduct.size,
          imageUrl: product.catalogProduct.imageUrl,
          price: Number(product.price),
          discountPrice: product.discountPrice == null ? null : Number(product.discountPrice),
          discountEndsAt: product.discountEndsAt?.toISOString() ?? null,
          stock: product.stock,
          storeName: product.store.name,
          storeSlug: product.store.slug,
        }))}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          imageUrl: category.imageUrl,
          productCount: category._count.catalogProducts,
        }))}
      />
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
