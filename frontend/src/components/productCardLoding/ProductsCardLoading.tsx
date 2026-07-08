export default function ProductCardSkeleton() {
  return (
    <div className="my-5 w-60 border border-gray-200 py-4 rounded-xs sm:mx-4 animate-pulse">
      <div className="h-52 flex justify-center items-center">
        <div className="w-4/5 h-40 bg-gray-200 rounded-md" />
      </div>

      <div className="px-3 h-32 flex flex-col justify-between mt-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />

        <div className="h-4 w-1/4 bg-gray-200 rounded" />

        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
}