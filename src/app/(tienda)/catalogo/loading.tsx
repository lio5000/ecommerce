import Navbar from "@/components/Navbar";

export default function CatalogoLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4 space-y-4 animate-pulse"
            >
              <div className="h-48 w-full bg-gray-200 rounded-lg" />
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-6 w-1/3 bg-gray-200 rounded pt-2" />
              <div className="h-10 w-full bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
