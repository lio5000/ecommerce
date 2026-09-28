import Navbar from "@/components/Navbar";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-100 space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-16 w-full bg-gray-100 rounded-lg" />
            <div className="h-16 w-full bg-gray-100 rounded-lg" />
          </div>
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-100 space-y-4 animate-pulse">
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-100 rounded-lg" />
            <div className="h-12 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
