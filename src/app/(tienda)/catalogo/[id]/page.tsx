import { apiClient } from "@/lib/api-client";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

// Función auxiliar para formatear la URL de la imagen y evitar errores de renderizado
const getImageUrl = (url?: string) => {
  if (!url) return "https://picsum.photos/500/500";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
    "http://127.0.0.1:8000";
  return `${baseUrl}/${url.replace(/^\//, "")}`;
};

async function getProduct(id: string): Promise<Product | null> {
  const res = await apiClient<Product>(`/products/${id}`, {
    next: { tags: [`producto-${id}`] },
  });
  if (res.error || !res.data) return null;
  return res.data;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | NextStore`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
          <div className="relative h-80 md:h-full min-h-[320px] bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={getImageUrl(product.image_url)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl font-extrabold text-gray-900 mt-4">
                ${Number(product.price).toFixed(2)}
              </p>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">
                  Descripción
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
