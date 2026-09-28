"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { confirmOrderPaymentAction } from "@/actions/orders";

export default function CheckoutForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Error al procesar el pago");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await confirmOrderPaymentAction(orderId, paymentIntent.id);
      clearCart();
      router.push(`/checkout/confirmacion?orderId=${orderId}`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isLoading ? "Procesando pago seguro..." : "Pagar ahora"}
      </button>
    </form>
  );
}
