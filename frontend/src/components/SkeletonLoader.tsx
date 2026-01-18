export const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

export const SkeletonList = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex gap-6">
            <div className="w-48 h-32 bg-gray-300 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
