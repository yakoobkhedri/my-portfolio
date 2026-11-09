import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import {
    MessageCircle,
    Pin,
    PinOff,
    Trash2,
    Loader2,
    AlertCircle,
    Search,
    UserCircle2,
    Calendar,
    Filter
} from "lucide-react";
import {
    useAllComments,
    useTogglePinComment,
    useDeleteComment
} from "../../hooks/useComments";

const AdminComments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all | pinned | unpinned

    const { data: comments = [], isLoading, error } = useAllComments();
    const togglePin = useTogglePinComment();
    const deleteComment = useDeleteComment();

    // فیلتر و جستجو
    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            // فیلتر
            if (filter === "pinned" && !comment.is_pinned) return false;
            if (filter === "unpinned" && comment.is_pinned) return false;

            // جستجو
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    comment.user_name?.toLowerCase().includes(search) ||
                    comment.content?.toLowerCase().includes(search)
                );
            }

            return true;
        });
    }, [comments, filter, searchTerm]);

    // آمار
    const stats = useMemo(() => ({
        total: comments.length,
        pinned: comments.filter((c) => c.is_pinned).length,
        unpinned: comments.filter((c) => !c.is_pinned).length,
    }), [comments]);

    const handleTogglePin = (comment) => {
        togglePin.mutate({
            id: comment.id,
            is_pinned: !comment.is_pinned,
        }, {
            onSuccess: () => successAlert(
                comment.is_pinned ? "Unpinned" : "Pinned",
                comment.is_pinned ? "Comment unpinned." : "Comment pinned to top."
            ),
        });
    };

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
                    <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
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
                <title>Manage Comments — Admin Panel</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-14 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <MessageCircle className="w-8 h-8 text-pink-500" />
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                                    Comments
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage all comments from your portfolio.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-30"
                >
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-pink-500/20">
                                <MessageCircle className="w-5 h-5 text-pink-500" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.total}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                                <Pin className="w-5 h-5 text-indigo-500" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Pinned</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.pinned}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-gray-500/20">
                                <MessageCircle className="w-5 h-5 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Unpinned</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.unpinned}
                        </div>
                    </div>
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6 relative z-30"
                >
                    <div className="relative flex-grow group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search comments..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
                        <Filter className="w-4 h-4 text-gray-400 ml-2" />
                        {[
                            { key: "all", label: "All" },
                            { key: "pinned", label: "Pinned" },
                            { key: "unpinned", label: "Unpinned" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === item.key
                                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
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
                            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                No comments found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm || filter !== "all"
                                    ? "Try adjusting your search or filter."
                                    : "Comments from your portfolio will appear here."}
                            </p>
                        </div>
                    ) : (
                        filteredComments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`bg-white dark:bg-white/5 rounded-2xl p-5 border transition-all group ${comment.is_pinned
                                    ? "border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                    : "border-gray-200 dark:border-white/10 hover:border-pink-500/30"
                                    }`}
                            >
                                {/* Pinned Badge */}
                                {comment.is_pinned && (
                                    <div className="flex items-center gap-2 mb-3 text-indigo-500">
                                        <Pin className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wide">
                                            Pinned Comment
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    {comment.profile_image ? (
                                        <img
                                            src={comment.profile_image}
                                            alt={comment.user_name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-full bg-indigo-500/20 text-indigo-500 flex-shrink-0">
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
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed break-words">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleTogglePin(comment)}
                                            disabled={togglePin.isPending}
                                            className={`p-2 rounded-lg transition-all disabled:opacity-50 ${comment.is_pinned
                                                ? "bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30"
                                                : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                                                }`}
                                            title={comment.is_pinned ? "Unpin" : "Pin"}
                                        >
                                            {comment.is_pinned ? (
                                                <PinOff className="w-4 h-4" />
                                            ) : (
                                                <Pin className="w-4 h-4" />
                                            )}
                                        </button>
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

export default AdminComments;