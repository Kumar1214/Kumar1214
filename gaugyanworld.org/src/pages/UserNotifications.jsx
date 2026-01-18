import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import { LayoutDashboard, Wallet, BookOpen, ShoppingBag, Trophy, Award, Heart, Settings, Bell } from 'lucide-react';

const UserNotifications = () => {
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/wallet', label: 'My Wallet', icon: Wallet },
        { path: '/my-courses', label: 'My Learning', icon: BookOpen },
        { path: '/my-orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/my-results', label: 'Performance', icon: Trophy },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/wishlist', label: 'Wishlist', icon: Heart },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/profile', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans">
            {/* Background Effects (reused from UserDashboard to match theme) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px]" />
            </div>

            <DashboardLayout
                menuItems={menuItems}
                sidebarTitle="GauGyan"
                title="Notifications"
                subtitle="Your latest updates and alerts."
                darkMode={true}
            >
                <div className="relative z-10">
                    <NotificationCenter />
                </div>
            </DashboardLayout>
        </div>
    );
};

export default UserNotifications;
