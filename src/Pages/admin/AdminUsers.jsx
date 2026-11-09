import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import {
  Users,
  Loader2,
  AlertCircle,
  Search,
  UserCircle2,
  Calendar,
  Shield,
  ShieldCheck,
  Trash2,
  Mail
} from "lucide-react";
import {
  useUsers,
  useUpdateUserRole,
  useDeleteUser
} from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading, error } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  // فیلتر
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const search = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(search) ||
        u.full_name?.toLowerCase().includes(search) ||
        u.role?.toLowerCase().includes(search)
    );
  }, [users, searchTerm]);

  // آمار
  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role !== "admin").length,
  }), [users]);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const confirmed = await confirmAlert(
      "Change Role?",
      `Change ${user.email}'s role to "${newRole}"?`,
      "Yes, change it!" // ← پارامتر سوم
    );

    if (confirmed) {
      updateRole.mutate({ id: user.id, role: newRole }, {
        onSuccess: () => successAlert("Role Updated", `User role changed to ${newRole}.`),
        onError: () => errorAlert("Error", "Failed to update role."),
      });
    }
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) {
      errorAlert("Not Allowed", "You cannot delete your own account!");
      return;
    }

    const confirmed = await confirmAlert(
      "Delete User?",
      `Delete user "${user.email}"? This action cannot be undone.`,
      "Yes, delete it!" // ← اینجا هم صریح بذار
    );

    if (confirmed) {
      deleteUser.mutate(user.id, {
        onSuccess: () => successAlert("Deleted!", "User has been deleted."),
        onError: () => errorAlert("Error", "Failed to delete user."),
      });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
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
            Error Loading Users
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Users — Admin Panel</title>
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
                <Users className="w-8 h-8 text-indigo-500" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Users
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage registered users and their roles.
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
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.total}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Admins</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.admins}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <UserCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Regular Users</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.regularUsers}
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email, name, or role..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 relative z-30"
        >
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try a different search term."
                  : "Registered users will appear here."}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.email}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30 flex-shrink-0"
                    />
                  ) : (
                    <div className="p-2.5 rounded-full bg-indigo-500/20 text-indigo-500 flex-shrink-0">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                        {user.full_name || "Unnamed User"}
                      </h3>
                      {user.role === "admin" && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.id === currentUser?.id && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-600 dark:text-green-300">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggleRole(user)}
                      disabled={updateRole.isPending || user.id === currentUser?.id}
                      className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${user.role === "admin"
                        ? "bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                        }`}
                      title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deleteUser.isPending || user.id === currentUser?.id}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
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

export default AdminUsers;