export default function SkeletonShimmer() {
  return (
    <div className="animate-pulse comic-panel bg-white dark:bg-gray-800">
      <div className="comic-badge -top-4 -right-4 rotate-12 bg-gray-300 dark:bg-gray-600 text-transparent w-16 h-6 rounded">.</div>
      <div className="flex-1 flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
      </div>
    </div>
  );
}
