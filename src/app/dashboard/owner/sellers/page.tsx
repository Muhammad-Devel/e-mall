import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SellerManager } from "@/components/seller-manager";

export default async function SellersPage() {
  const session = await auth();
  if (!session?.user?.storeId) redirect("/login");

  const sellers = await prisma.user.findMany({
    where: { storeId: session.user.storeId, role: "SELLER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      createdAt: true,
      sales: {
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <SellerManager
      initialSellers={sellers.map((s) => ({
        id: s.id,
        fullName: s.fullName,
        phone: s.phone,
        createdAt: s.createdAt.toISOString(),
        saleCount: s.sales.length,
        totalSales: s.sales.reduce((sum, sale) => sum + Number(sale.total), 0),
        lastSaleAt: s.sales[0]?.createdAt.toISOString() ?? null,
      }))}
    />
  );
}
