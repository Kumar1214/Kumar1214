import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ toggleSidebar }) => {
    const { user } = useAuth();
    return (
        <header style={{
            height: '64px',
            backgroundColor: 'white',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    className="lg:hidden"
                >
                    <Menu size={24} />
                </button>

                <div style={{ position: 'relative', width: '300px' }} className="hidden-mobile">
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 36px',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#F9FAFB',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button style={{ position: 'relative', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#EF4444',
                        borderRadius: '50%'
                    }} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'right' }} className="hidden-mobile">
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>
                            {user?.displayName || user?.firstName || 'User'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                        </div>
                    </div>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#E0E7FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4F46E5'
                    }}>
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
