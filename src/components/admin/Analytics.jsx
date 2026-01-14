import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, BookOpen, DollarSign, Eye, Heart, Music, Download, BarChart3, Calendar } from 'lucide-react';
import { useData } from '../../context/useData';

const Analytics = () => {
    const { courses, users, products, orders, music, podcasts, meditation, news, knowledgebase, gaushalas } = useData();
    const [timeRange, setTimeRange] = useState('30days');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Calculate statistics
    const stats = {
        totalUsers: users?.length || 0,
        totalCourses: courses?.length || 0,
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalRevenue: orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
        totalMusic: music?.length || 0,
        totalPodcasts: podcasts?.length || 0,
        totalMeditation: meditation?.length || 0,
        totalNews: news?.length || 0,
        totalKnowledgebase: knowledgebase?.length || 0,
        totalGaushalas: gaushalas?.length || 0
    };

    // User growth data (mock - in production, fetch from API)
    const userGrowthData = [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 180 },
        { month: 'Mar', users: 250 },
        { month: 'Apr', users: 320 },
        { month: 'May', users: 410 },
        { month: 'Jun', users: 500 }
    ];

    // Revenue data (mock)
    const revenueData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 68000 },
        { month: 'Apr', revenue: 75000 },
        { month: 'May', revenue: 89000 },
        { month: 'Jun', revenue: 105000 }
    ];

    // Top performing content
    const topCourses = courses?.sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 5) || [];
    const topProducts = products?.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5) || [];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                    Analytics & Reporting
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Track your platform performance and key metrics
                </p>
            </div>

            {/* Time Range Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                </select>
                
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                >
                    <option value="all">All Categories</option>
                    <option value="education">Education</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="content">Content</option>
                </select>

                <button style={{ padding: '8px 16px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <Download size={16} /> Export Report
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* Total Users */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#EFF6FF' }}>
                            <Users size={24} style={{ color: '#3B82F6' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Users</h4>
                            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1F2937' }}>{stats.totalUsers.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#10B981' }}>
                        <TrendingUp size={14} /> +12.5% vs last month
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ECFDF5' }}>
                            <DollarSign size={24} style={{ color: '#10B981' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Revenue</h4>
                            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1F2937' }}>₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#10B981' }}>
                        <TrendingUp size={14} /> +18.2% vs last month
                    </div>
                </div>

                {/* Total Orders */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                            <ShoppingCart size={24} style={{ color: '#F59E0B' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Orders</h4>
                            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1F2937' }}>{stats.totalOrders.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#10B981' }}>
                        <TrendingUp size={14} /> +8.7% vs last month
                    </div>
                </div>

                {/* Total Courses */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F3E8FF' }}>
                            <BookOpen size={24} style={{ color: '#9333EA' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Courses</h4>
                            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1F2937' }}>{stats.totalCourses.toLocaleString()}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#10B981' }}>
                        <TrendingUp size={14} /> +5 new this month
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* User Growth Chart */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} /> User Growth
                    </h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0' }}>
                        {userGrowthData.map((item, index) => (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5' }}>{item.users}</div>
                                <div style={{ width: '100%', backgroundColor: '#4F46E5', height: `${(item.users / 500) * 150}px`, borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.month}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={20} /> Revenue Trend
                    </h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0' }}>
                        {revenueData.map((item, index) => (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10B981' }}>₹{(item.revenue / 1000).toFixed(0)}k</div>
                                <div style={{ width: '100%', backgroundColor: '#10B981', height: `${(item.revenue / 105000) * 150}px`, borderRadius: '4px 4px 0 0' }}></div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.month}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Performance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* Top Courses */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Top Performing Courses</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {topCourses.map((course, index) => (
                            <div key={course.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '600' }}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{course.title?.substring(0, 40)}...</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{course.students || 0} students</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10B981' }}>
                                    {course.rating || 0}⭐
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Statistics */}
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Platform Statistics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                <Music size={16} /> Music Tracks
                            </div>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{stats.totalMusic}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                <Eye size={16} /> Podcasts
                            </div>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{stats.totalPodcasts}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                <Heart size={16} /> Meditation Sessions
                            </div>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{stats.totalMeditation}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                <BookOpen size={16} /> Knowledgebase Articles
                            </div>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{stats.totalKnowledgebase}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                <Heart size={16} /> Gaushalas
                            </div>
                            <div style={{ fontWeight: 600, color: '#1F2937' }}>{stats.totalGaushalas}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Generate Reports</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <button style={{ padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Download size={16} /> User Report (CSV)
                    </button>
                    <button style={{ padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Download size={16} /> Sales Report (PDF)
                    </button>
                    <button style={{ padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Download size={16} /> Content Report (CSV)
                    </button>
                    <button style={{ padding: '12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Download size={16} /> Revenue Report (Excel)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
