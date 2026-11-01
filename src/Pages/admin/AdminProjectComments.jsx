import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import {
  MessageSquare,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  UserCircle2,
  Calendar,
  FolderKanban,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useAllProjectComments,
  useDeleteProjectComment
} from "../../hooks/useProjectComments";

const AdminProjectComments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: comments = [], isLoading, error } = useAllProjectComments();
  const deleteComment = useDeleteProjectComment();

  // فیلتر و جستجو
  const filteredComments = useMemo(() => {
    if (!searchTerm) return comments;
    const search = searchTerm.toLowerCase();
    return comments.filter(
      (c) =>
        c.user_name?.toLowerCase().includes(search) ||
        c.content?.toLowerCase().includes(search) ||
        c.projects?.title?.toLowerCase().includes(search)
    );
  }, [comments, searchTerm]);

  // آمار
  const stats = useMemo(() => {
    const uniqueProjects = new Set(comments.map((c) => c.project_id));
    return {
      total: comments.length,
      projects: uniqueProjects.size,
    };
  }, [comments]);

  const handleDelete = async (comment) => {
    const confirmed = await confirmAlert(
      "Delete Comment?",
      `Delete comment from "${comment.user_name}"?`
    );

    if (confirmed) {
      deleteComment.mutate(comment.id, {
        onSuccess: () => successAlert("Deleted!", "Comment has been deleted."),
        onError: () => errorAlert("Error", "Failed to delete comment."),
      });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
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
            Error Loading Comments
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Project Comments — Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-8 h-8 text-cyan-500" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Project Comments
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage comments on your portfolio projects.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <MessageSquare className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Comments</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.total}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <FolderKanban className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Projects with Comments</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.projects}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, content, or project..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Comments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 relative z-30"
        >
          {filteredComments.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No comments found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try a different search term."
                  : "Comments on your projects will appear here."}
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {comment.profile_image ? (
                    <img
                      src={comment.profile_image}
                      alt={comment.user_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/30 flex-shrink-0"
                    />
                  ) : (
                    <div className="p-2.5 rounded-full bg-cyan-500/20 text-cyan-500 flex-shrink-0">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {comment.user_name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>

                    {/* Project Badge */}
                    {comment.projects && (
                      <Link
                        to={`/project/${comment.project_id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 mb-2 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs hover:bg-indigo-500/20 transition-all"
                      >
                        <FolderKanban className="w-3 h-3" />
                        {comment.projects.title}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDelete(comment)}
                      disabled={deleteComment.isPending}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AdminProjectComments;