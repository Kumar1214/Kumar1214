import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ShoppingBag, BarChart2, Settings, LogOut, Plus, MessageSquare, Star, CheckCircle, XCircle, GraduationCap, ClipboardList, Trash2, Edit, Ban, Shield, Bell, User, Music, Mic, Heart, BookMarked, Home as HomeIcon, Newspaper, Store, Package, DollarSign, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/useData';
import { useNavigate, useLocation } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';

// Component Imports
import CourseManagement from '../components/admin/CourseManagement';
import UserManagement from '../components/admin/UserManagement';
import ExamManagement from '../components/admin/ExamManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import QuizManagement from '../components/admin/QuizManagement';
import QuestionBankManagement from '../components/admin/QuestionBankManagement';
import ContentApprovals from '../components/admin/ContentApprovals';
import MeditationManagement from './admin-new/Musics/Meditations';
import MusicManagement from '../components/admin/MusicManagement';
import PodcastManagement from '../components/admin/PodcastManagement';
import ProductManagement from './admin/ecommerce/ProductManagement';
import AdminContactMessages from './admin/AdminContactMessages';
import AdminOrderManagement from './admin/ecommerce/OrderManagement';
import AdminCouponManagement from './admin/AdminCouponManagement';
import AdminGaushalaManagement from './admin-new/Gaushala/Gaushalas';
import AdminWalletManagement from './admin/AdminWalletManagement';
import AdminCertificateSettings from './admin/AdminCertificateSettings';
import AdminSliderManagement from './admin/AdminSliderManagement';
import AdminAdvertisement from './admin/AdminAdvertisement';
import AdminNewsManagement from './admin-new/Content/News';
import AdminVendorManagement from './admin/ecommerce/VendorManagement';
import AdminPayoutManagement from './admin/AdminPayoutManagement';
import AdminBannerManagement from './admin/AdminBannerManagement';
import AdminReviewManagement from './admin/AdminReviewManagement';
import AdminCommissionManagement from './admin/AdminCommissionManagement';
import AdminMediaLibrary from './admin/AdminMediaLibrary';
import AdminSettings from './admin/AdminSettings';
import AdminKnowledgebaseManagement from './admin-new/Content/Knowledgebase';
import Analytics from '../components/admin/Analytics';
import Notifications from '../components/admin/Notifications';
import MobileAppTesting from '../components/admin/MobileAppTesting';

import Sidebar from '../components/admin/Sidebar';
import TopBar from '../components/admin/TopBar';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getActiveTab = () => {
        const path = location.pathname.split('/admin/')[1];
        if (!path) return 'overview';
        return path.split('/')[0];
    };

    const activeTab = getActiveTab();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user || user.role !== 'admin') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Access Denied. Admins only.</p>
                <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Sidebar activeTab={activeTab} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'margin-left 0.3s ease',
                marginLeft: '260px'
            }} className="admin-main-content">
                <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main style={{ flex: 1, padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            Welcome back, {user.displayName}
                        </div>
                    </div>

                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'approvals' && <ContentApprovals />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'courses' && <CourseManagement />}
                    {activeTab === 'exams' && <ExamManagement />}
                    {activeTab === 'quizzes' && <QuizManagement />}
                    {activeTab === 'questions' && <QuestionBankManagement />}
                    {activeTab === 'music' && <MusicManagement />}
                    {activeTab === 'podcasts' && <PodcastManagement />}
                    {activeTab === 'meditation' && <MeditationManagement />}
                    {activeTab === 'knowledgebase' && <AdminKnowledgebaseManagement />}

                    {activeTab === 'news' && <AdminNewsManagement />}
                    {activeTab === 'vendors' && <AdminVendorManagement />}
                    {activeTab === 'orders' && <AdminOrderManagement />}
                    {activeTab === 'payouts' && <AdminPayoutManagement />}
                    {activeTab === 'banners' && <AdminBannerManagement />}
                    {activeTab === 'media' && <AdminMediaLibrary />}
                    {activeTab === 'reviews' && <AdminReviewManagement />}
                    {activeTab === 'commissions' && <AdminCommissionManagement />}
                    {activeTab === 'products' && <ProductManagement />}
                    {activeTab === 'feedback' && <FeedbackTab />}
                    {activeTab === 'settings' && <AdminSettings />}
                    {activeTab === 'categories' && <CategoryManagement />}
                    {activeTab === 'contact' && <AdminContactMessages />}

                    {activeTab === 'coupons' && <AdminCouponManagement />}
                    {activeTab === 'wallet' && <AdminWalletManagement />}
                    {activeTab === 'gaushala-admin' && <AdminGaushalaManagement />}
                    {activeTab === 'certificates' && <AdminCertificateSettings />}
                    {activeTab === 'sliders' && <AdminSliderManagement />}
                    {activeTab === 'advertisements' && <AdminAdvertisement />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'notifications' && <Notifications />}
                    {activeTab === 'mobile-testing' && <MobileAppTesting />}
                </main>
            </div>
            <style>{`
                @media (max-width: 1024px) {
                    .admin-main-content { margin-left: 0 !important; }
                }
            `}</style>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: active ? '#374151' : 'transparent',
            color: active ? 'white' : '#D1D5DB',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%'
        }}
    >
        {icon} {label}
    </button>
);

const OverviewTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <StatCard title="Total Users" value="1,234" change="+12%" icon={<Users size={24} color="#3B82F6" />} />
        <StatCard title="Total Revenue" value="₹45,600" change="+8%" icon={<BarChart2 size={24} color="#10B981" />} />
        <StatCard title="Active Courses" value="24" change="+2" icon={<BookOpen size={24} color="#F59E0B" />} />
        <StatCard title="Product Sales" value="156" change="+15%" icon={<ShoppingBag size={24} color="#EC4899" />} />
    </div>
);

const StatCard = ({ title, value, change, icon }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: '#F3F4F6' }}>
            {icon}
        </div>
        <div>
            <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{value}</div>
            <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 500 }}>{change} from last month</div>
        </div>
    </div>
);



const SettingsTab = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                <Settings size={20} color="#4B5563" />
                <h3 style={{ fontSize: '1.2rem' }}>General Settings</h3>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 500 }}>Site Name</div>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>The name of your LMS platform</div>
                    </div>
                    <input type="text" defaultValue="Gaugyan LMS" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 500 }}>Maintenance Mode</div>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Disable access for non-admins</div>
                    </div>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                <Shield size={20} color="#4B5563" />
                <h3 style={{ fontSize: '1.2rem' }}>Security</h3>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 500 }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Require 2FA for all admin accounts</div>
                    </div>
                    <button style={{ padding: '8px 16px', backgroundColor: '#E5E7EB', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Enable</button>
                </div>
            </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                <Bell size={20} color="#4B5563" />
                <h3 style={{ fontSize: '1.2rem' }}>Notifications</h3>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Email me when a new user registers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Email me when a new course is published</span>
                </div>
            </div>
        </div>

        {/* Roles & Permissions */}
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User size={20} color="#4B5563" />
                    <h3 style={{ fontSize: '1.2rem' }}>Roles & Permissions</h3>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <Plus size={16} /> Create New Role
                </button>
            </div>

            {/* Existing Roles */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#374151' }}>Existing Roles</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                        { name: 'Super Admin', users: 2, color: '#DC2626' },
                        { name: 'Admin', users: 5, color: '#EA580C' },
                        { name: 'Instructor', users: 45, color: '#2563EB' },
                        { name: 'Artist', users: 23, color: '#7C3AED' },
                        { name: 'Vendor', users: 18, color: '#059669' },
                        { name: 'Gaushala Owner', users: 12, color: '#0891B2' },
                    ].map((role, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: role.color }}></div>
                                <span style={{ fontWeight: 500 }}>{role.name}</span>
                                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>({role.users} users)</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Edit Permissions</button>
                                {!['Super Admin', 'Admin'].includes(role.name) && (
                                    <button style={{ padding: '6px 12px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2', fontSize: '0.85rem' }}>Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Matrix Example */}
            <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#374151' }}>Permission Matrix (Example: Instructor Role)</h4>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}>
                            <tr>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Module</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>View</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Create</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Edit</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '2px solid #E5E7EB', fontWeight: 600 }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { module: 'Courses', view: true, create: true, edit: true, delete: true },
                                { module: 'Exams', view: true, create: true, edit: true, delete: false },
                                { module: 'Quizzes', view: true, create: true, edit: true, delete: false },
                                { module: 'Users', view: true, create: false, edit: false, delete: false },
                                { module: 'Music', view: true, create: false, edit: false, delete: false },
                                { module: 'Podcasts', view: true, create: false, edit: false, delete: false },
                                { module: 'Products', view: true, create: false, edit: false, delete: false },
                                { module: 'Orders', view: true, create: false, edit: false, delete: false },
                                { module: 'Vendors', view: false, create: false, edit: false, delete: false },
                                { module: 'Payouts', view: false, create: false, edit: false, delete: false },
                                { module: 'Settings', view: false, create: false, edit: false, delete: false },
                            ].map((perm, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{perm.module}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <input type="checkbox" defaultChecked={perm.view} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <input type="checkbox" defaultChecked={perm.create} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <input type="checkbox" defaultChecked={perm.edit} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <input type="checkbox" defaultChecked={perm.delete} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button style={{ padding: '8px 20px', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'white' }}>Cancel</button>
                    <button onClick={() => alert('Permissions saved successfully!')} style={{ padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Save Permissions</button>
                </div>
            </div>
        </div>
    </div>
);






const FeedbackTab = () => {
    const mockFeedback = [
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', category: 'Bug Report', rating: 4, subject: 'Login Issue', message: 'Having trouble logging in from mobile device', status: 'pending', date: '2024-11-25' },
        { id: 2, name: 'Priya Sharma', email: 'priya@example.com', category: 'Feature Request', rating: 5, subject: 'Dark Mode', message: 'Please add dark mode feature to the platform', status: 'resolved', date: '2024-11-24' },
        { id: 3, name: 'Amit Patel', email: 'amit@example.com', category: 'Course Related', rating: 3, subject: 'Video Quality', message: 'Video quality is poor in Ayurveda course', status: 'pending', date: '2024-11-23' },
        { id: 4, name: 'Sunita Reddy', email: 'sunita@example.com', category: 'General Feedback', rating: 5, subject: 'Great Platform', message: 'Love the content and user experience!', status: 'resolved', date: '2024-11-22' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                <h3>User Feedback</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <span style={{ padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>Pending: 2</span>
                    <span style={{ padding: '6px 12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>Resolved: 2</span>
                </div>
            </div>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {mockFeedback.map(feedback => (
                    <div key={feedback.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                            <div>
                                <h4 style={{ marginBottom: '4px' }}>{feedback.subject}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>{feedback.name} • {feedback.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                <span style={{ padding: '4px 12px', backgroundColor: '#EEF2FF', color: '#4338CA', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>{feedback.category}</span>
                            </div>
                        </div>
                        <p style={{ color: '#4B5563', lineHeight: '1.5' }}>{feedback.message}</p>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < feedback.rating ? "#FBBF24" : "none"} color={i < feedback.rating ? "#FBBF24" : "#D1D5DB"} />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{feedback.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
