import { apiClient } from "@/lib/api-client";
import { Order } from "@/types";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Package } from "lucide-react";

async function getUserOrders(): Promise<Order[]> {
  const res = await apiClient<Order[]>("/user/orders", {
    next: { tags: ["historial-ordenes"] },
  });

  if (res.error || !res.data) {
    return [];
  }

  return res.data;
}

export default async function OrdenesPage() {
  const orders = await getUserOrders();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Historial de Compras
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Consulta tus órdenes anteriores y sus estados.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aún no has realizado ninguna compra.
            </p>
            <Link
              href="/catalogo"
              className="mt-4 inline-block px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Ir a Comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500 block">Orden</span>
                    <span className="font-mono font-bold text-gray-900">
                      #{order.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Fecha</span>
                    <span className="text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Estado</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        order.status === "completed" || order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Total</span>
                    <span className="text-lg font-extrabold text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Productos
                    </h4>
                    <ul className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="py-2 flex justify-between text-sm"
                        >
                          <span className="text-gray-800">
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="font-medium text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
