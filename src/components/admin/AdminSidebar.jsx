import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  MessageCircle,
  MessageSquare,
  Mail,
  Users,
  Settings,
  LogOut,
  X,
  Home
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { confirmAlert } from "../../utils/alerts";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { path: "/admin/certificates", icon: Award, label: "Certificates" },
  { path: "/admin/messages", icon: Mail, label: "Messages" },
  { path: "/admin/comments", icon: MessageCircle, label: "Comments" },
  { path: "/admin/project-comments", icon: MessageSquare, label: "Project Comments" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await confirmAlert(
      "Logout?",
      "Are you sure you want to logout?"
    );

    if (confirmed) {
      await signOut();
      navigate("/");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#0a0a1a] border-r border-gray-200 dark:border-white/10 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-indigo-500/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Site
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;