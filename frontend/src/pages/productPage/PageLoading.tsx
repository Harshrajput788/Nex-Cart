import "./index.css"

const ProductSkeleton = () => {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          <div className="lg:sticky lg:top-20">
            <div className="aspect-square rounded-2xl skeleton border border-gray-200" />

            <div className="flex gap-2.5 px-5 py-3 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl skeleton border border-gray-200"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">

            <div>
              <div className="h-3 w-24 mb-3 skeleton rounded" />
              <div className="h-9 w-3/4 skeleton rounded mb-2" />
              <div className="h-4 w-full skeleton rounded" />
              <div className="h-4 w-5/6 skeleton rounded mt-2" />
            </div>

            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded skeleton" />
              ))}
              <div className="h-4 w-16 skeleton rounded ml-2" />
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-end gap-3">
              <div className="h-10 w-32 skeleton rounded" />
              <div className="h-6 w-20 skeleton rounded" />
            </div>

            <div className="h-6 w-40 skeleton rounded" />

            <hr className="border-gray-200" />

            <div className="flex items-center gap-3">
              <div className="h-4 w-12 skeleton rounded" />
              <div className="h-10 w-28 skeleton rounded-xl" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-12 flex-1 skeleton rounded-xl" />
              <div className="h-12 flex-1 skeleton rounded-xl" />
            </div>

            <hr className="border-gray-200" />

            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-20 skeleton rounded" />
              ))}
            </div>

            <div className="space-y-3 pt-3">
              <div className="h-4 w-full skeleton rounded" />
              <div className="h-4 w-11/12 skeleton rounded" />
              <div className="h-4 w-10/12 skeleton rounded" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl skeleton border border-gray-200"
                />
              ))}
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 mt-16 py-6 text-center">
        <div className="h-3 w-40 mx-auto skeleton rounded" />
      </footer>
    </div>
  );
};

export default ProductSkeleton;