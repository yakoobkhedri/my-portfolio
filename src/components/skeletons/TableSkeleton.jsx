import { memo } from "react";
import { SkeletonLine, SkeletonCircle } from "./SkeletonBase";

const TableSkeleton = memo(({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10"
      >
        <div className="flex items-center gap-4">
          <SkeletonCircle size={48} />
          <div className="flex-grow space-y-2">
            <SkeletonLine width="40%" height="18px" />
            <SkeletonLine width="60%" height="14px" />
          </div>
          <SkeletonLine width="100px" height="36px" className="rounded-lg" />
        </div>
      </div>
    ))}
  </div>
));

export default TableSkeleton;