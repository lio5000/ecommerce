"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function CatalogoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado en segmento /catalogo:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-20 flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center w-full space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Error al cargar el catálogo
          </h2>
          <p className="text-sm text-gray-600">
            Ocurrió un inconveniente al conectar con el servidor o procesar los
            productos.
          </p>

          <button
            onClick={() => reset()}
            className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </main>
    </div>
  );
}
