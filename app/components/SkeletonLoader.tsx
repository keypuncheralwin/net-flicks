type SkeletonLoaderProps = {
  title?: string;
};

export default function SkeletonLoader({ title }: SkeletonLoaderProps) {
  const marginTopClass = title ? 'mt-20' : 'mt-10';

  return (
    <div
      className={`relative space-y-0.5 md:space-y-0.5 ${marginTopClass} -mb-[120px]`}
    >
      {title && (
        <h2 className="absolute top-0 p-1 left-0 cursor-pointer text-2xl font-semibold text-[#e5e5e5] transition duration-200 hover:text-white z-20">
          {title}
        </h2>
      )}
      <div className="relative">
        <div className="flex h-60 items-center space-x-3.5 overflow-hidden scrollbar-hide md:space-x-4">
          {Array.from({ length: 20 }, (_, index) => (
            <div
              key={index}
              className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] rounded-sm overflow-hidden bg-gray-700"
            >
              <div
                className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"
                style={{ backgroundSize: '200% 200%' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
