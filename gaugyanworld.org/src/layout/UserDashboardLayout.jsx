import React from 'react';
import DashboardLayout from './DashboardLayout';
import { LayoutDashboard, BookOpen, ShoppingBag, Trophy, Heart, Users, Award, Wallet, Settings } from 'lucide-react';

const UserDashboardLayout = ({ children, title, subtitle }) => {
    const userMenuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/wallet', label: 'My Wallet', icon: Wallet },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/my-courses', label: 'My Learning', icon: BookOpen },
        { path: '/my-orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/my-results', label: 'Performance & Results', icon: Trophy },
        { path: '/certificates', label: 'My Certificates', icon: Award },
        { path: '/wishlist', label: 'Wishlist', icon: Heart },
        { path: '/profile', label: 'Settings', icon: Settings },
    ];

    return (
        <DashboardLayout
            menuItems={userMenuItems}
            sidebarTitle="My Account"
            title={title}
            subtitle={subtitle}
        >
            {children}
        </DashboardLayout>
    );
};

export default UserDashboardLayout;
