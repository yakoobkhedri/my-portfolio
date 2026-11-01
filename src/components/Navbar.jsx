import React, { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useSiteSettings } from "../hooks/useSiteSettings";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const { user, signOut } = useAuth();
    const { data: settings } = useSiteSettings();
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === "/";

    // منوی صفحه اصلی (لینک‌های # + Dropdown)
    const homeNavItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portfolio" },
        { href: "#Contact", label: "Contact" },
    ];

    // صفحات جدا (توی Dropdown صفحه اصلی)
    const moreItems = [
        { href: "/about", label: "More About Me" },
        { href: "/contact", label: "Contact Page" },
    ];

    // منوی صفحات داخلی (لینک‌های Route مستقیم، بدون Dropdown)
    const pageNavItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            if (!isHomePage) return;

            const sections = homeNavItems
                .map((item) => {
                    const section = document.querySelector(item.href);
                    if (section) {
                        return {
                            id: item.href.replace("#", ""),
                            offset: section.offsetTop - 550,
                            height: section.offsetHeight,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(
                (section) =>
                    currentPosition >= section.offset &&
                    currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]);

    // بستن منوها موقع تغییر مسیر
    useEffect(() => {
        setIsOpen(false);
        setShowUserMenu(false);
        setShowMoreMenu(false);
    }, [location.pathname]);

    // بستن Dropdownها با کلیک بیرون
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".more-dropdown")) {
                setShowMoreMenu(false);
            }
            if (!e.target.closest(".user-menu")) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();

        if (!isHomePage) {
            navigate("/" + href);
            return;
        }

        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({ top, behavior: "smooth" });
        }
        setIsOpen(false);
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await signOut();
            setShowUserMenu(false);
            navigate("/");
        }
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${isOpen
                    ? "bg-white dark:bg-[#030014]"
                    : scrolled
                        ? "bg-white/80 dark:bg-[#030014]/50 backdrop-blur-xl shadow-sm dark:shadow-none"
                        : "bg-transparent"
                }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                to="/"
                                className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
                            >
                                {settings?.site_name?.split(" ")[0] || "EkiZR"}
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-6">
                            {isHomePage ? (
                                // صفحه اصلی: لینک‌های # + Dropdown
                                <>
                                    {homeNavItems.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={(e) => scrollToSection(e, item.href)}
                                            className="group relative px-1 py-2 text-sm font-medium"
                                        >
                                            <span
                                                className={`relative z-10 transition-colors duration-300 ${activeSection === item.href.substring(1)
                                                        ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                        : "text-gray-700 dark:text-[#e2d3fd] group-hover:text-gray-900 dark:group-hover:text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </span>
                                            <span
                                                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${activeSection === item.href.substring(1)
                                                        ? "scale-x-100"
                                                        : "scale-x-0 group-hover:scale-x-100"
                                                    }`}
                                            />
                                        </a>
                                    ))}

                                    {/* More Dropdown */}
                                    <div className="relative more-dropdown">
                                        <button
                                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                                            className="flex items-center gap-1 px-1 py-2 text-sm font-medium text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            More
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${showMoreMenu ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {showMoreMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1b4b] rounded-xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden z-50">
                                                {moreItems.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.href}
                                                        onClick={() => setShowMoreMenu(false)}
                                                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // صفحات داخلی: لینک‌های Route مستقیم
                                pageNavItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.href}
                                        className={`group relative px-1 py-2 text-sm font-medium transition-colors ${location.pathname === item.href
                                                ? "text-indigo-500 font-semibold"
                                                : "text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        {item.label}
                                        {location.pathname === item.href && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full" />
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative user-menu">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all text-sm font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="max-w-[100px] truncate">
                                        {user.email?.split("@")[0]}
                                    </span>
                                    <ChevronDown
                                        className={`w-3 h-3 transition-transform ${showUserMenu ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1b4b] rounded-xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden z-50">
                                        <Link
                                            to="/admin/dashboard"
                                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-all border-t border-gray-200 dark:border-white/10"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white text-sm font-medium transition-all hover:scale-105"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {user && (
                            <Link
                                to="/admin/dashboard"
                                className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"
                                aria-label="Dashboard"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                            </Link>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white transition-transform duration-300 ease-in-out transform ${isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
                        ? "max-h-screen opacity-100 overflow-y-auto"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-4 py-6 space-y-2">
                    {isHomePage ? (
                        // صفحه اصلی: لینک‌های # + More Pages
                        <>
                            {homeNavItems.map((item, index) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all ${activeSection === item.href.substring(1)
                                            ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                            : "text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                        }`}
                                    style={{
                                        transitionDelay: `${index * 50}ms`,
                                        transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    {item.label}
                                </a>
                            ))}

                            {/* More Pages - Mobile */}
                            <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-4">
                                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    More Pages
                                </p>
                                {moreItems.map((item, index) => (
                                    <Link
                                        key={item.label}
                                        to={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                                        style={{
                                            transitionDelay: `${(index + 4) * 50}ms`,
                                            transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        // صفحات داخلی: لینک‌های Route مستقیم
                        pageNavItems.map((item, index) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all ${location.pathname === item.href
                                        ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                        : "text-gray-700 dark:text-[#e2d3fd] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                    transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                    opacity: isOpen ? 1 : 0,
                                }}
                            >
                                {item.label}
                            </Link>
                        ))
                    )}

                    {/* Mobile Auth */}
                    <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-4">
                        {user ? (
                            <>
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Logged in as{" "}
                                    <strong className="text-indigo-500">{user.email}</strong>
                                </div>
                                <Link
                                    to="/admin/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-gray-700 dark:text-[#e2d3fd] hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-lg font-medium text-red-500 hover:bg-red-500/10 rounded-lg"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-center rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;