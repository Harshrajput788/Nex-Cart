const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`} />
);

const ProductSkeleton = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10" aria-busy="true" aria-label="Loading product">
      {/* Breadcrumb */}
      <Bar className="mb-6 h-4 w-56" />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <Bar className="aspect-square w-full !rounded-3xl" />
          <div className="mt-4 flex gap-3 p-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bar key={i} className="h-16 w-16 shrink-0 !rounded-xl sm:h-20 sm:w-20" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <Bar className="mb-3 h-4 w-24" />
            <Bar className="mb-2 h-10 w-3/4" />
            <Bar className="h-4 w-full" />
            <Bar className="mt-2 h-4 w-5/6" />
          </div>

          <Bar className="h-5 w-40" />

          <div className="flex items-end gap-3 border-y border-gray-100 py-5">
            <Bar className="h-10 w-36" />
            <Bar className="h-6 w-20" />
          </div>

          <Bar className="h-7 w-36 !rounded-full" />

          {/* Variants */}
          <div>
            <Bar className="mb-3 h-4 w-32" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Bar className="h-24 !rounded-2xl" />
              <Bar className="h-24 !rounded-2xl" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Bar className="h-4 w-16" />
            <Bar className="h-10 w-32 !rounded-full" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Bar className="h-14 flex-1 !rounded-full" />
            <Bar className="h-14 flex-1 !rounded-full" />
          </div>

          <div className="flex gap-8 border-b border-gray-200 pb-3">
            <Bar className="h-4 w-24" />
            <Bar className="h-4 w-16" />
          </div>

          <div className="space-y-3">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
            <Bar className="h-4 w-10/12" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bar key={i} className="h-20 !rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductSkeleton;