import { apiClient } from "@/lib/api-client";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;

const getImageUrl = (url?: string) => {
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500";
};

async function getProducts(): Promise<Product[]> {
  const res = await apiClient<any>("/products", {
    next: { tags: ["productos"] },
  });

  if (res.error || !res.data) {
    return [];
  }

  if (Array.isArray(res.data)) {
    return res.data;
  } else if (res.data.data && Array.isArray(res.data.data)) {
    return res.data.data;
  }

  return [];
}

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Explora nuestros productos disponibles con entrega rápida y pago
            seguro.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              No hay productos disponibles por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col"
              >
                <Link
                  href={`/catalogo/${product.id}`}
                  className="relative h-48 w-full bg-gray-100 block"
                >
                  <Image
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/catalogo/${product.id}`}>
                    <h2 className="font-semibold text-lg text-gray-900 hover:underline line-clamp-1">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-grow">
                    {product.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
