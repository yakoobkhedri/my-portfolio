import { Loader2 } from "lucide-react";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

export default PageLoader;