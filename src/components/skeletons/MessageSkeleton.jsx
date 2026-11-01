import { memo } from "react";
import { SkeletonLine, SkeletonCircle } from "./SkeletonBase";

const MessageSkeleton = memo(() => (
  <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10">
    <div className="flex items-start gap-4">
      <SkeletonCircle size={40} />
      <div className="flex-grow space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonLine width="30%" height="18px" />
          <SkeletonLine width="20%" height="12px" />
        </div>
        <SkeletonLine width="100%" height="14px" />
        <SkeletonLine width="80%" height="14px" />
        <div className="flex gap-2 pt-2">
          <SkeletonLine width="100px" height="32px" className="rounded-lg" />
          <SkeletonLine width="80px" height="32px" className="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
));

export default MessageSkeleton;