import { memo } from "react";
import { SkeletonLine, SkeletonRect, SkeletonCircle } from "./SkeletonBase";

const ProjectCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10">
    {/* Image */}
    <SkeletonRect height="180px" className="mb-4" />

    {/* Title */}
    <SkeletonLine width="70%" height="24px" className="mb-3" />

    {/* Description */}
    <SkeletonLine width="100%" height="14px" className="mb-2" />
    <SkeletonLine width="85%" height="14px" className="mb-4" />

    {/* Footer */}
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2">
        <SkeletonCircle size={16} />
        <SkeletonLine width="40px" height="12px" />
      </div>
      <SkeletonLine width="80px" height="36px" className="rounded-lg" />
    </div>
  </div>
));

export default ProjectCardSkeleton;