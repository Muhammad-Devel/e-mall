"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LayoutDashboard, Package, Users, ClipboardList, ShoppingCart, Settings, LogOut, Warehouse, Tags, Send, Bell, Store, SlidersHorizontal, Receipt, BarChart3, Tag, CreditCard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DashboardNotifications } from "@/components/dashboard-notifications";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { signOutAction } from "@/actions/session";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV_ITEMS: Record<string, NavItem[]> = {
  SUPER_ADMIN: [
    { href: "/dashboard/admin/analytics", label: "Analitika", icon: BarChart3 },
    { href: "/dashboard/admin", label: "Do'konlar", icon: LayoutDashboard },
    { href: "/dashboard/admin/store-types", label: "Do'kon turlari", icon: Store },
    { href: "/dashboard/admin/categories", label: "Kategoriyalar", icon: Tags },
    { href: "/dashboard/admin/products", label: "Mahsulotlar", icon: Package },
    { href: "/dashboard/admin/attributes", label: "Mahsulot maydonlari", icon: SlidersHorizontal },
    { href: "/dashboard/admin/requests", label: "So'rovlar", icon: Send },
    { href: "/dashboard/admin/users", label: "Foydalanuvchilar", icon: Users },
    { href: "/dashboard/notifications", label: "Bildirishnomalar", icon: Bell },
    { href: "/dashboard/admin/settings", label: "Sozlamalar", icon: Settings },
    { href: "/dashboard/admin/billing", label: "Billing boshqaruvi", icon: CreditCard },
  ],
  OWNER: [
    { href: "/dashboard/owner", label: "Umumiy ko'rinish", icon: LayoutDashboard },
    { href: "/dashboard/owner/products", label: "Mahsulotlar", icon: Package },
    { href: "/dashboard/owner/warehouse", label: "Ombor", icon: Warehouse },
    { href: "/dashboard/owner/sellers", label: "Sotuvchilar", icon: Users },
    { href: "/dashboard/owner/orders", label: "Buyurtmalar", icon: ClipboardList },
    { href: "/dashboard/owner/requests", label: "Mening so'rovlarim", icon: Send },
    { href: "/dashboard/pos", label: "POS", icon: ShoppingCart },
    { href: "/dashboard/owner/sales", label: "Savdolar tarixi", icon: Receipt },
    { href: "/dashboard/owner/coupons", label: "Kuponlar", icon: Tag },
    { href: "/dashboard/owner/billing", label: "Obuna va to'lovlar", icon: CreditCard },
    { href: "/dashboard/notifications", label: "Bildirishnomalar", icon: Bell },
    { href: "/dashboard/owner/settings", label: "Sozlamalar", icon: Settings },
  ],
  SELLER: [
    { href: "/dashboard/pos", label: "POS", icon: ShoppingCart },
    { href: "/dashboard/notifications", label: "Bildirishnomalar", icon: Bell },
  ],
};

export function DashboardShell({
  role,
  storeName,
  userName,
  children,
}: {
  role: string;
  storeName?: string | null;
  userName: string;
  children: React.ReactNode;
}) {
  const items = NAV_ITEMS[role] ?? [];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const nav = (isCollapsed: boolean) => (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-label={isCollapsed ? item.label : undefined}
            className={cn(
              "group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isCollapsed && "justify-center px-2",
              active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {!isCollapsed && item.label}
            {isCollapsed && (
              <span
                role="tooltip"
                className="pointer-events-none absolute top-1/2 left-full z-[100] ml-3 -translate-x-1 -translate-y-1/2 scale-95 whitespace-nowrap rounded-lg border border-border/80 bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-100 group-focus-visible:opacity-100"
              >
                {item.label}
                <span className="absolute top-1/2 right-full -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-border/80" />
                <span className="absolute top-1/2 right-full -mr-px -translate-y-1/2 border-y-[4px] border-r-[4px] border-y-transparent border-r-popover" />
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <NotificationsProvider role={role}>
      <div className="flex min-h-svh flex-col md:flex-row">
        <aside
          className={cn(
            "relative z-40 hidden shrink-0 border-r bg-muted/20 p-4 transition-[width] duration-200 md:sticky md:top-0 md:flex md:h-svh md:flex-col",
            collapsed ? "w-20" : "w-56"
          )}
        >
          <div className="mb-6 flex items-center justify-between gap-2">
            <div data-no-transliterate className={cn("flex items-center gap-2 font-semibold", collapsed && "justify-center")}>
              <Image src="/logo-96.png" alt="" width={24} height={24} className="rounded-md" priority />
              {!collapsed && "e-mall.uz"}
            </div>
            {!collapsed && <DashboardNotifications />}
          </div>
          {storeName && !collapsed && <p className="mb-4 truncate text-xs text-muted-foreground">{storeName}</p>}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            title={collapsed ? "Sidebarni ochish" : "Sidebarni yopish"}
            aria-label={collapsed ? "Sidebarni ochish" : "Sidebarni yopish"}
            onClick={() => setCollapsed((value) => !value)}
            className="absolute top-5 -right-4 z-10 rounded-full bg-background shadow-sm"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
          {nav(collapsed)}
          <form action={signOutAction} className="mt-auto pt-4">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              title={collapsed ? "Chiqish" : undefined}
              className={cn(
                "w-full gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300",
                collapsed ? "justify-center px-2" : "justify-start"
              )}
            >
              <LogOut className="size-4" />
              {!collapsed && "Chiqish"}
            </Button>
          </form>
        </aside>

        <header className="flex items-center justify-between border-b p-3 md:hidden">
          <div data-no-transliterate className="flex items-center gap-2 font-semibold">
            <Image src="/logo-96.png" alt="" width={24} height={24} className="rounded-md" priority />
            e-mall.uz
          </div>
          <div className="flex items-center gap-2">
            <DashboardNotifications />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon" />}>
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <SheetTitle className="mb-4">{storeName ?? userName}</SheetTitle>
                {nav(false)}
                <form action={signOutAction} className="mt-4">
                  <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
                    <LogOut className="size-4" />
                    Chiqish
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </NotificationsProvider>
  );
}
