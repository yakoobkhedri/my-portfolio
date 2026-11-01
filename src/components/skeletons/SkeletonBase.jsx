import { memo } from "react";

// خط اسکلت
export const SkeletonLine = memo(({ width = "100%", height = "16px", className = "" }) => (
  <div
    className={`bg-gray-200 dark:bg-white/10 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
));

// دایره اسکلت (برای آواتار)
export const SkeletonCircle = memo(({ size = 40, className = "" }) => (
  <div
    className={`bg-gray-200 dark:bg-white/10 rounded-full animate-pulse ${className}`}
    style={{ width: size, height: size }}
  />
));

// مستطیل اسکلت (برای عکس)
export const SkeletonRect = memo(({ width = "100%", height = "200px", className = "" }) => (
  <div
    className={`bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse ${className}`}
    style={{ width, height }}
  />
));

// کارت اسکلت پایه
export const SkeletonCard = memo(({ className = "" }) => (
  <div
    className={`bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 ${className}`}
  >
    <SkeletonRect height="160px" className="mb-4" />
    <SkeletonLine width="70%" height="20px" className="mb-2" />
    <SkeletonLine width="100%" height="14px" className="mb-1" />
    <SkeletonLine width="90%" height="14px" className="mb-4" />
    <div className="flex justify-between items-center pt-2">
      <SkeletonLine width="30%" height="14px" />
      <SkeletonLine width="25%" height="32px" className="rounded-lg" />
    </div>
  </div>
));