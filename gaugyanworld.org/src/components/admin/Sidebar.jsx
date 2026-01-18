import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookMarked,
    Heart,
    Newspaper,
    Package,
    Store,
    ShoppingBag,
    DollarSign,
    Image,
    Layers,
    MessageSquare,
    CheckCircle,
    Mail,
    Tag,
    Wallet,
    Award,
    Megaphone,
    Star,
    Percent,
    Video,
    LogOut,
    ChevronDown,
    ChevronRight,
    BookOpen,
    Users,
    GraduationCap,
    ClipboardList,
    Music,
    Mic,
    Settings,
    X,
    BarChart3,
    Bell,
    Smartphone
} from 'lucide-react';

import logo from '../../assets/logo.png';

const MenuItem = ({ icon: Icon, label, path, hasSubmenu, submenuKey, expanded, onToggle, isActive }) => {
    if (hasSubmenu) {
        return (
            <div className="menu-item-group">
                <div
                    className={`menu-item ${expanded ? 'expanded' : ''}`}
                    onClick={() => onToggle(submenuKey)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        color: '#6B7280',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={20} />
                        <span style={{ fontWeight: 500 }}>{label}</span>
                    </div>
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
            </div>
        );
    }

    return (
        <Link
            to={path}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                textDecoration: 'none',
                color: isActive ? '#4F46E5' : '#6B7280',
                backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                borderRight: isActive ? '3px solid #4F46E5' : '3px solid transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 500
            }}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({
        education: true,
        entertainment: false,
        users: false
    });

    const toggleSubmenu = (menu) => {
        setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isPathActive = (path) => location.pathname === path;

    return (
        <>
            {/* Sidebar Container */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '260px',
                    backgroundColor: 'white',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    zIndex: 50,
                    overflowY: 'auto',
                }}
                className="admin-sidebar"
            >
                {/* Logo Area */}
                < div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={logo} alt="Gaugyan" style={{ height: '40px' }} />

                    </div>
                    <button onClick={toggleSidebar} style={{ display: 'lg-none', background: 'none', border: 'none', cursor: 'pointer' }} className="lg:hidden">
                        <X size={20} />
                    </button>
                </div >

                {/* Navigation */}
                <nav style={{ padding: '16px 0' }}>
                    <MenuItem icon={LayoutDashboard} label="Overview" path="/admin" isActive={isPathActive('/admin')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Education
                    </div>
                    <MenuItem icon={Users} label="Users" path="/admin/users" isActive={isPathActive('/admin/users')} />
                    <MenuItem icon={BookOpen} label="Courses" path="/admin/courses" isActive={isPathActive('/admin/courses')} />
                    <MenuItem icon={GraduationCap} label="Exams" path="/admin/exams" isActive={isPathActive('/admin/exams')} />
                    <MenuItem icon={ClipboardList} label="Quizzes" path="/admin/quizzes" isActive={isPathActive('/admin/quizzes')} />
                    <MenuItem icon={ClipboardList} label="Question Bank" path="/admin/questions" isActive={isPathActive('/admin/questions')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Entertainment
                    </div>
                    <MenuItem icon={Music} label="Music" path="/admin/music" isActive={isPathActive('/admin/music')} />
                    <MenuItem icon={Mic} label="Podcasts" path="/admin/podcasts" isActive={isPathActive('/admin/podcasts')} />
                    <MenuItem icon={Video} label="Meditation" path="/admin/meditation" isActive={isPathActive('/admin/meditation')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Content
                    </div>
                    <MenuItem icon={BookMarked} label="Knowledgebase" path="/admin/knowledgebase" isActive={isPathActive('/admin/knowledgebase')} />

                    <MenuItem icon={Newspaper} label="News" path="/admin/news" isActive={isPathActive('/admin/news')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        E-Commerce
                    </div>
                    <MenuItem icon={Package} label="Products" path="/admin/products" isActive={isPathActive('/admin/products')} />
                    <MenuItem icon={Store} label="Vendors" path="/admin/vendors" isActive={isPathActive('/admin/vendors')} />
                    <MenuItem icon={ShoppingBag} label="Orders" path="/admin/orders" isActive={isPathActive('/admin/orders')} />
                    <MenuItem icon={DollarSign} label="Payouts" path="/admin/payouts" isActive={isPathActive('/admin/payouts')} />
                    <MenuItem icon={Percent} label="Commissions" path="/admin/commissions" isActive={isPathActive('/admin/commissions')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Moderation
                    </div>
                    <MenuItem icon={CheckCircle} label="Approvals" path="/admin/approvals" isActive={isPathActive('/admin/approvals')} />
                    <MenuItem icon={Star} label="Reviews" path="/admin/reviews" isActive={isPathActive('/admin/reviews')} />
                    <MenuItem icon={Megaphone} label="Advertisements" path="/admin/advertisements" isActive={isPathActive('/admin/advertisements')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Management
                    </div>
                    <MenuItem icon={Image} label="Banners" path="/admin/banners" isActive={isPathActive('/admin/banners')} />
                    <MenuItem icon={Layers} label="Media Library" path="/admin/media" isActive={isPathActive('/admin/media')} />
                    <MenuItem icon={Tag} label="Coupons" path="/admin/coupons" isActive={isPathActive('/admin/coupons')} />
                    <MenuItem icon={Wallet} label="Wallet Management" path="/admin/management/wallet" isActive={isPathActive('/admin/management/wallet')} />
                    <MenuItem icon={Heart} label="Gaushala Admin" path="/admin/gaushala-admin" isActive={isPathActive('/admin/gaushala-admin')} />
                    <MenuItem icon={Award} label="Certificates" path="/admin/certificates" isActive={isPathActive('/admin/certificates')} />
                    <MenuItem icon={Image} label="Home Sliders" path="/admin/sliders" isActive={isPathActive('/admin/sliders')} />
                    <MenuItem icon={MessageSquare} label="Feedback" path="/admin/feedback" isActive={isPathActive('/admin/feedback')} />
                    <MenuItem icon={Mail} label="Contact Messages" path="/admin/contact" isActive={isPathActive('/admin/contact')} />
                    <MenuItem icon={Settings} label="Settings" path="/admin/settings" isActive={isPathActive('/admin/settings')} />

                    <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Analytics & Tools
                    </div>
                    <MenuItem icon={BarChart3} label="Analytics" path="/admin/analytics" isActive={isPathActive('/admin/analytics')} />
                    <MenuItem icon={Bell} label="Notifications" path="/admin/notifications" isActive={isPathActive('/admin/notifications')} />
                    <MenuItem icon={Smartphone} label="Mobile App" path="/admin/mobile-testing" isActive={isPathActive('/admin/mobile-testing')} />

                </nav>

                {/* Footer */}
                <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '10px',
                        border: 'none',
                        backgroundColor: '#FEF2F2',
                        color: '#EF4444',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <style>{`
                @media (max-width: 1023px) {
                    .admin-sidebar {
                        transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
                        transition: transform 0.3s ease;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
