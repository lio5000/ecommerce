import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-commerce Next.js",
  description: "Tienda en línea optimizada con App Router y Web Vitals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
