import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import {
  Mail,
  MailOpen,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Inbox
} from "lucide-react";
import {
  useMessages,
  useMarkAsRead,
  useDeleteMessage
} from "../../hooks/useMessages";
import MessageCard from "../../components/MessageCard";
import MessageSkeleton from "../../components/skeletons/MessageSkeleton";

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread | read

  const { data: messages = [], isLoading, error } = useMessages();
  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteMessage();

  // فیلتر و جستجو
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // فیلتر
      if (filter === 'unread' && msg.is_read) return false;
      if (filter === 'read' && !msg.is_read) return false;

      // جستجو
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          msg.name?.toLowerCase().includes(search) ||
          msg.email?.toLowerCase().includes(search) ||
          msg.subject?.toLowerCase().includes(search) ||
          msg.message?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [messages, filter, searchTerm]);

  // آمار
  const stats = useMemo(() => ({
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    read: messages.filter(m => m.is_read).length,
  }), [messages]);

  const handleMarkAsRead = (id) => {
    markAsRead.mutate(id, {
      onSuccess: () => successAlert("Marked as Read", "Message marked as read."),
    });
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert(
      "Delete Message?",
      "Are you sure you want to delete this message?"
    );

    if (confirmed) {
      deleteMessage.mutate(id, {
        onSuccess: () => successAlert("Deleted!", "Message has been deleted."),
        onError: () => errorAlert("Error", "Failed to delete message."),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
        <div className="mb-8">
          <div className="h-12 w-64 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
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
            Error Loading Messages
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Messages — Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all incoming messages from the contact form.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Inbox className="w-5 h-5 text-blue-500" />
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
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Unread</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.unread}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <MailOpen className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Read</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.read}
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 relative z-30 bg-white dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === item.key
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredMessages.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No messages found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'When someone contacts you, their message will appear here.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                isMarkingAsRead={markAsRead.isPending}
                isDeleting={deleteMessage.isPending}
              />
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AdminMessages;