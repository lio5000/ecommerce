// src/app/(tienda)/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/actions/orders";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { Trash2, ArrowLeft, CreditCard } from "lucide-react";

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } =
    useCart();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitCheckout = async () => {
    setIsCreatingOrder(true);
    setError(null);

    const result = await createOrderAction(cart);

    if (result.error || !result.data) {
      setError(result.error || "Error al iniciar la orden");
      setIsCreatingOrder(false);
      return;
    }

    const createdOrderId = result.data.id;
    // Buscar el client_secret en los campos comunes que envía Stripe en Laravel
    const secret =
      result.data.client_secret ||
      (result.data as any).stripe_client_secret ||
      (result.data as any).payment_intent_secret;

    setOrderId(createdOrderId);

    if (secret) {
      setClientSecret(secret);
      setIsCreatingOrder(false);
    } else {
      // Si la API creó la orden directamente sin Stripe PaymentIntent (pago directo / efectivo)
      clearCart();
      router.push(`/checkout/confirmacion?orderId=${createdOrderId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuar comprando</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Resumen de Checkout
        </h1>

        {cart.length === 0 && !clientSecret ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
            <Link
              href="/catalogo"
              className="mt-4 inline-block px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Resumen de Items */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Productos en tu Carrito
                </h2>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ${Number(item.product.price).toFixed(2)} c/u
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product.id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
                        />
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total y Pasarela de Pago */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen del Pago
                </h2>

                <div className="space-y-3 text-sm pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                    <span>Total a pagar</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-6">
                  {!clientSecret ? (
                    <button
                      onClick={handleInitCheckout}
                      disabled={isCreatingOrder || cart.length === 0}
                      className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {isCreatingOrder
                          ? "Procesando Orden..."
                          : "Proceder al Pago"}
                      </span>
                    </button>
                  ) : (
                    orderId &&
                    stripePromise && (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: { theme: "stripe" },
                        }}
                      >
                        <CheckoutForm orderId={orderId} />
                      </Elements>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
