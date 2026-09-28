"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
        added
          ? "bg-green-600 text-white"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" />
          <span>¡Agregado!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>Agregar al carrito</span>
        </>
      )}
    </button>
  );
}
