"use server";

import { apiClient } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { CartItem } from "@/types";

export async function createOrderAction(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    return { error: "El carrito está vacío" };
  }

  // Mapear items al formato esperado por la API de Laravel
  const items = cartItems.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
  }));

  const res = await apiClient<{
    id: number;
    client_secret?: string;
    total: number;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });

  if (res.error || !res.data) {
    return { error: res.error || "No se pudo generar la orden de compra" };
  }

  // Revalidar la ruta del historial de órdenes para actualizar la interfaz en el servidor
  revalidatePath("/ordenes");

  return { data: res.data };
}

export async function confirmOrderPaymentAction(
  orderId: number,
  paymentIntentId: string,
) {
  const res = await apiClient(`/orders/${orderId}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({ payment_intent_id: paymentIntentId }),
  });

  if (res.error) {
    return { error: res.error };
  }

  // Revalidar la ruta para que al navegar a /ordenes aparezca la nueva compra
  revalidatePath("/ordenes");

  return { success: true };
}
