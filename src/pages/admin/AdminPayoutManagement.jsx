import React, { useState } from 'react';
import { DollarSign, Search, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import { useData } from '../../context/useData';

const AdminPayoutManagement = () => {
    const { users } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Mock payout data - in production, this would come from backend
    const mockPayouts = [
        { id: 1, vendorId: 2, vendorName: 'Organic Farms India', amount: 15000, status: 'pending', requestDate: '2024-11-28', type: 'vendor', period: 'November 2024' },
        { id: 2, vendorId: 3, vendorName: 'Dr. Rajesh Sharma', amount: 8500, status: 'completed', requestDate: '2024-11-25', completedDate: '2024-11-27', type: 'instructor', period: 'November 2024' },
        { id: 3, vendorId: 4, vendorName: 'Yoga Essentials', amount: 12300, status: 'pending', requestDate: '2024-11-27', type: 'vendor', period: 'November 2024' },
        { id: 4, vendorId: 5, vendorName: 'Pandit Hariprasad', amount: 5600, status: 'processing', requestDate: '2024-11-26', type: 'artist', period: 'November 2024' },
    ];

    const filteredPayouts = mockPayouts.filter(payout =>
        (filterStatus === 'all' || payout.status === filterStatus) &&
        (payout.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payout.period?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return { bg: '#10B98120', color: '#10B981' };
            case 'pending': return { bg: '#FEF3C7', color: '#92400E' };
            case 'processing': return { bg: '#3B82F620', color: '#3B82F6' };
            case 'rejected': return { bg: '#EF444420', color: '#EF4444' };
            default: return { bg: '#F3F4F6', color: '#6B7280' };
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'vendor': return { bg: '#8B5CF620', color: '#8B5CF6' };
            case 'instructor': return { bg: '#3B82F620', color: '#3B82F6' };
            case 'artist': return { bg: '#EC489920', color: '#EC4899' };
            default: return { bg: '#F3F4F6', color: '#6B7280' };
        }
    };

    const totalPending = filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const totalCompleted = filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const totalProcessing = filteredPayouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Payout Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage payouts for vendors, instructors, and artists</p>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Total Payouts</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>{mockPayouts.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Pending</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>₹{totalPending.toLocaleString()}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Processing</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6' }}>₹{totalProcessing.toLocaleString()}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Completed</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>₹{totalCompleted.toLocaleString()}</div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: window.innerWidth > 768 ? '24px' : '16px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: window.innerWidth > 768 ? 'row' : 'column',
                    gap: '16px',
                    alignItems: window.innerWidth > 768 ? 'center' : 'stretch',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth > 768 ? '400px' : '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search payouts..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#F97316'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Payouts Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>ID</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Recipient</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Type</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Period</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Amount</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Date</th>
                                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayouts.length > 0 ? (
                                    filteredPayouts.map((payout) => {
                                        const statusStyle = getStatusColor(payout.status);
                                        const typeStyle = getTypeColor(payout.type);
                                        return (
                                            <tr key={payout.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 500, color: '#1F2937' }}>
                                                    #{payout.id}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <User size={16} style={{ color: '#6B7280' }} />
                                                        <span style={{ fontWeight: 500, color: '#1F2937' }}>{payout.vendorName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: typeStyle.bg,
                                                        color: typeStyle.color,
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {payout.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                                    {payout.period}
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>
                                                    ₹{payout.amount.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {payout.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Calendar size={14} />
                                                        {payout.requestDate}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                        {payout.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => alert('Approve payout functionality')}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        backgroundColor: '#10B98120',
                                                                        color: '#10B981',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        fontSize: '0.875rem',
                                                                        fontWeight: 500,
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px'
                                                                    }}
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => alert('Reject payout functionality')}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        backgroundColor: '#EF444420',
                                                                        color: '#EF4444',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        fontSize: '0.875rem',
                                                                        fontWeight: 500,
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px'
                                                                    }}
                                                                >
                                                                    <XCircle size={16} />
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {payout.status === 'completed' && (
                                                            <span style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: 500 }}>
                                                                Paid on {payout.completedDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <DollarSign size={40} style={{ opacity: 0.5 }} />
                                                <span>No payouts found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayoutManagement;
