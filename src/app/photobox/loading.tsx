import SkeletonShimmer from "@/components/SkeletonShimmer";

export default function PhotoboxLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 border-4 border-black animate-pulse" />
        <div className="h-7 w-56 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 border-4 border-black animate-pulse" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 border-4 border-black animate-pulse" />
        </div>
        <div className="md:col-span-2">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 border-4 border-black animate-pulse" />
        </div>
      </div>
    </div>
  );
}
