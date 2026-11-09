import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import CategoryChart from "../../components/charts/CategoryChart";
import MessageStatusChart from "../../components/charts/MessageStatusChart";
import ActivityChart from "../../components/charts/ActivityChart";
import ViewsChart from "../../components/charts/ViewsChart";
import {
  FolderKanban,
  Award,
  Mail,
  MessageCircle,
  Eye,
  Loader2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats, useAdvancedStats } from "../../hooks/useDashboardStats";
import StatsCard from "../../components/StatsCard";

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { data: advancedStats, isLoading: isLoadingAdvanced } = useAdvancedStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Error Loading Stats
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      icon: FolderKanban,
      label: "Total Projects",
      value: stats.projects,
      color: "indigo",
    },
    {
      icon: Award,
      label: "Certificates",
      value: stats.certificates,
      color: "purple",
    },
    {
      icon: Mail,
      label: "Messages",
      value: stats.messages,
      subValue: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null,
      color: "blue",
    },
    {
      icon: MessageCircle,
      label: "Comments",
      value: stats.comments,
      color: "pink",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      color: "green",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard — Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-14 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-indigo-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your portfolio's performance and activity.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          {statsData.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-white/5 relative z-30 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/10"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/admin/messages"
              className="group flex items-center justify-between p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  Messages
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/projects"
              className="group flex items-center justify-between p-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  Projects
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/certificates"
              className="group flex items-center justify-between p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  Certificates
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/"
              className="group flex items-center justify-between p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  View Site
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Analytics
            </h2>
          </div>

          {isLoadingAdvanced ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Last 7 Days Activity
                </h3>
                <ActivityChart data={advancedStats?.last7Days} />
              </div>

              {/* Message Status */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Message Status
                </h3>
                <MessageStatusChart data={advancedStats?.messageStatusData} />
              </div>

              {/* Category Distribution */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Projects by Category
                </h3>
                <CategoryChart data={advancedStats?.categoryData} />
              </div>

              {/* Top Viewed Projects */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Most Viewed Projects
                </h3>
                <ViewsChart data={advancedStats?.viewsData} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardStats;