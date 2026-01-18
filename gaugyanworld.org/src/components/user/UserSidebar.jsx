import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Trophy, Heart, User, Users, LogOut, Award, Wallet, Globe, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserSidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
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

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Sidebar */}
            <aside style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '260px',
                backgroundColor: 'white',
                boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                zIndex: 50,
                transform: window.innerWidth < 1024 && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EA580C', margin: 0 }}>My Account</h2>
                </div>

                <nav style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (window.innerWidth < 1024 && toggleSidebar) toggleSidebar();
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                backgroundColor: isActive(item.path) ? '#FFF7ED' : 'transparent',
                                color: isActive(item.path) ? '#EA580C' : '#4B5563',
                                border: 'none',
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'left',
                                fontWeight: isActive(item.path) ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            width: '100%',
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <Globe size={20} />
                        Visit Website
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            width: '100%',
                            backgroundColor: '#FEF2F2',
                            color: '#EF4444',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && window.innerWidth < 1024 && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 40
                    }}
                />
            )}
        </>
    );
};

export default UserSidebar;
