import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { ScriptProvider } from "@/contexts/script-context";
import { ScriptTransliterator } from "@/components/script-transliterator";
import { ThemeScheduleProvider } from "@/contexts/theme-schedule-context";
import { ThemeScheduler } from "@/components/theme-scheduler";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "e-mall.uz — Do'konlar uchun marketplace va POS",
  description: "Do'konlar ro'yxatdan o'tib, onlayn vitrina va POS tizimini bir joyda boshqaradi.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "e-mall.uz",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1c54d6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeScheduleProvider>
            <ScriptProvider>
              {children}
              <ScriptTransliterator />
              <ThemeScheduler />
              <Toaster position="top-center" />
              <ServiceWorkerRegister />
            </ScriptProvider>
          </ThemeScheduleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
