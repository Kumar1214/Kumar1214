import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    FiHome,
    FiChevronRight,
    FiBell,
    FiSearch,
    FiUser,
    FiSettings,
    FiLogOut,
    FiChevronDown,
    FiRefreshCw
} from "react-icons/fi";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // Convert path → title format
    const formatPath = (path) => {
        if (!path) return "";
        return path.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const pathParts = location.pathname.split("/").filter(Boolean);

    // MAIN PAGE TITLE (last item)
    const mainTitle =
        pathParts.length === 0
            ? "Dashboard"
            : formatPath(pathParts[pathParts.length - 1]);




    const handleSearch = (e) => {
        if (e.key === "Enter") {
            // TODO: Implement search functionality
            console.log("Search triggered:", e.target.value);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* LEFT SIDE: Title + Breadcrumb */}
                <div className="flex-1 min-w-0 ">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                            {mainTitle}
                        </h2>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                        <FiChevronRight className="text-gray-300" size={14} />
                        {pathParts.map((part, index) => (
                            <div key={`breadcrumb-${part}-${index}`} className="flex items-center gap-2">
                                <span className="text-gray-600">{formatPath(part)}</span>
                                {index < pathParts.length - 1 && (
                                    <FiChevronRight className="text-gray-300" size={14} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: Search, Notifications, Profile */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            onKeyPress={handleSearch}
                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 w-64 bg-gray-50 focus:bg-white"
                        />
                    </div>

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin User'}
                                </span>
                                <span className="text-xs text-gray-500">{user?.role || 'Administrator'}</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0c2d50] to-[#1e4d7b] flex items-center justify-center shadow-sm">
                                <FiUser className="text-white" size={18} />
                            </div>
                            <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                                <div className="px-4 py-3 border-b border-gray-100 mb-1 lg:hidden">
                                    <p className="text-sm font-medium text-gray-900">{user?.firstName || 'Admin'}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>

                                <Link
                                    to="/admin/settings/profile"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0c2d50] transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <FiUser size={16} />
                                    My Profile
                                </Link>
                                <Link
                                    to="/admin/settings/general"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0c2d50] transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <FiSettings size={16} />
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        // Force reload from server to clear client cache
                                        window.location.href = '/admin/login';
                                        window.location.reload(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0c2d50] transition-colors text-left"
                                >
                                    <FiRefreshCw size={16} />
                                    Clear Cache
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <FiLogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

