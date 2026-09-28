"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ShoppingCart, User, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/catalogo"
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <ShoppingBag className="w-6 h-6 text-black" />
          <span>NextStore</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/catalogo"
            className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Catálogo
          </Link>
          <Link
            href="/ordenes"
            className="text-sm font-medium text-gray-700 hover:text-black transition flex items-center gap-1"
          >
            <User className="w-4 h-4" />
            <span>Mis Órdenes</span>
          </Link>

          <Link
            href="/checkout"
            className="relative flex items-center p-2 text-gray-700 hover:text-black transition"
            aria-label="Carrito de Compras"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-gray-500 hover:text-red-600 transition p-2"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
