import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FlyerModal } from "@/components/FlyerModal";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAMCORE TECHNOLOGIES | Laptops, Workstations & Electronics in Ghana (GH₵)",
  description:
    "Ghana's 100% online store for Apple MacBooks, ThinkPads, Creator Workstations, and Electronics. Transparent stock & direct WhatsApp order support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
        <StoreProvider>
          <Header />
          <FlyerModal />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
