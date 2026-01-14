import React, { useState, useEffect } from 'react';
import { FileText, CheckSquare, BarChart2, Settings, LayoutDashboard, Globe, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import AlertSection from '../components/dashboard/AlertSection';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import api from '../utils/api';

const EditorDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Data States
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const getInitialTab = () => {
        if (!location.hash) return 'overview';
        const hash = location.hash.replace('#', '');
        const menuPaths = ['overview', 'reviews', 'content', 'analytics', 'settings', 'community'];
        return menuPaths.includes(hash) ? hash : 'overview';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    // Fetch Editor Data
    useEffect(() => {
        const fetchEditorData = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                // Fetch Pending Reviews (Mock or Real)
                // const res = await api.get('/content/pending-review');
                // setPendingReviews(res.data || []);
                setPendingReviews([]); // Placeholder
            } catch (error) {
                console.error("Failed to fetch editor data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchEditorData();
    }, [user, activeTab]);

    // Sync tab with hash changes
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        const menuPaths = ['overview', 'reviews', 'content', 'analytics', 'settings', 'community'];
        if (hash && menuPaths.includes(hash)) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutDashboard, onClick: () => setActiveTab('overview') },
        { path: '#reviews', label: 'Pending Reviews', icon: CheckSquare, onClick: () => setActiveTab('reviews') },
        { path: '#content', label: 'All Content', icon: FileText, onClick: () => setActiveTab('content') },
        { path: '#analytics', label: 'Analytics', icon: BarChart2, onClick: () => setActiveTab('analytics') },
        { path: '#community', label: 'Community', icon: Globe, onClick: () => setActiveTab('community') },
        { path: '#settings', label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
    ];

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Editor Studio"
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        >
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <AlertSection alerts={[{ type: 'info', title: 'Welcome', message: 'You have no pending reviews.', time: 'Now', action: 'Refresh' }]} />
                        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Editor Dashboard</h3>
                            <p>Overview stats coming soon.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Pending Reviews</h3>
                        <p>No items pending review.</p>
                    </div>
                )}

                {activeTab === 'community' && <CommunityFeed />}

                {(activeTab === 'content' || activeTab === 'analytics' || activeTab === 'settings') && (
                    <div className="p-16 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Coming Soon</h3>
                        <p>This feature is under development.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EditorDashboard;
