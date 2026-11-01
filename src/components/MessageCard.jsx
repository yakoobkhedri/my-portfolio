import { memo } from "react";
import { Mail, MailOpen, Trash2, Calendar, User, Tag } from "lucide-react";

const MessageCard = memo(({ 
  message, 
  onMarkAsRead, 
  onDelete, 
  isMarkingAsRead,
  isDeleting 
}) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`relative rounded-2xl p-6 border transition-all duration-300 ${
        message.is_read
          ? "bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10"
          : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/30 shadow-lg"
      }`}
    >
      {/* Unread Badge */}
      {!message.is_read && (
        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-indigo-500 text-white rounded-full">
          New
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-2 rounded-xl ${
          message.is_read 
            ? "bg-gray-200 dark:bg-white/5" 
            : "bg-indigo-500/20"
        }`}>
          {message.is_read ? (
            <MailOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Mail className="w-5 h-5 text-indigo-500" />
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-white truncate">
            {message.subject}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {message.name}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {message.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(message.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Message Body */}
      <div className="bg-white dark:bg-black/20 rounded-xl p-4 mb-4 border border-gray-200 dark:border-white/5">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {!message.is_read && (
          <button
            onClick={() => onMarkAsRead(message.id)}
            disabled={isMarkingAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-all text-sm font-medium disabled:opacity-50"
          >
            <MailOpen className="w-4 h-4" />
            Mark as Read
          </button>
        )}
        <button
          onClick={() => onDelete(message.id)}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all text-sm font-medium disabled:opacity-50 ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
});

export default MessageCard;