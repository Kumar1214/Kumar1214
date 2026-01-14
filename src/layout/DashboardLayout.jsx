import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Globe, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ item, isActive, onClick, isOpen, darkMode }) => (
    <button
        onClick={() => onClick(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
            ${isActive
                ? (darkMode ? 'bg-gray-800 text-purple-400 font-semibold' : 'bg-orange-50 text-orange-600 font-semibold')
                : (darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium')
            }`}
    >
        <item.icon size={20} className={`${isActive ? (darkMode ? 'text-purple-400' : 'text-orange-600') : (darkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600')}`} />
        <span className={`${!isOpen && 'hidden lg:block'}`}>{item.label}</span>
    </button>
);

const Sidebar = ({ menuItems, isOpen, toggleSidebar, title = "My Account", darkMode, toggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const bgClass = darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100';

    const titleClass = darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500' : 'text-orange-600';
    const borderClass = darkMode ? 'border-gray-800' : 'border-gray-50';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 ease-in-out
                ${bgClass}
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className={`p-6 border-b ${borderClass} flex flex-col gap-4`}>
                    <div className="flex justify-between items-center">
                        <img src="/gaugyan-logo.png" alt="GauGyan" className="h-10 w-auto" />
                        <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className={`text-xl font-bold tracking-tight ${titleClass}`}>{title}</h2>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            item={item}
                            isActive={location.pathname === item.path || (item.activeCheck && item.activeCheck(location.pathname))}
                            onClick={(path) => {
                                if (item.onClick) item.onClick();
                                else navigate(path);
                                if (window.innerWidth < 1024) toggleSidebar();
                            }}
                            isOpen={true}
                            darkMode={darkMode}
                        />
                    ))}
                </nav>

                <div className={`p-4 border-t ${borderClass} space-y-2`}>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium mb-2
                            ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                            ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                        <Globe size={20} />
                        <span>Visit Website</span>
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                            ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}
                        `}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

const DashboardLayout = ({ children, menuItems, title, subtitle, sidebarTitle }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();

    // Determine styles based on theme
    const mainBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
    const textColor = darkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = darkMode ? 'text-gray-400' : 'text-gray-500';
    const headerBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';

    return (
        <div className={`min-h-screen font-sans ${mainBg} ${textColor}`}>
            <Sidebar
                menuItems={menuItems}
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                title={sidebarTitle}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />

            {/* Page Content */}
            <div className="lg:pl-64 transition-all duration-300">
                {/* Mobile Header */}
                <header className={`sticky top-0 z-30 border-b px-4 py-3 lg:hidden flex items-center justify-between shadow-sm ${headerBg}`}>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 -ml-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Menu size={24} />
                    </button>
                    <span className={`font-semibold ${textColor}`}>{sidebarTitle || 'Dashboard'}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-orange-100 text-orange-600'}`}>
                        {user?.displayName?.charAt(0) || 'U'}
                    </div>
                </header>

                <main className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {(title || subtitle) && (
                        <div className="mb-8">
                            {title && <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight mb-2 ${textColor}`}>{title}</h1>}
                            {subtitle && <p className={`text-lg ${subTextColor}`}>{subtitle}</p>}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
