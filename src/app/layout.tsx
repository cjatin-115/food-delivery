import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToastHost } from "@/components/ToastHost";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TastyTrail — soft & simple food delivery",
    template: "%s · TastyTrail",
  },
  description:
    "Order from the best restaurants around you. Minimalistic food delivery, brought to your door warm and on time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <ToastHost />
        </CartProvider>
      </body>
    </html>
  );
}
