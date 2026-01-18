import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/useData';
import { Mail, Clock, CheckSquare, Search, RefreshCw, X } from 'lucide-react';

const AdminContactMessages = () => {
    const navigate = useNavigate();
    const { contactMessages, deleteContactMessage, markMessageAsRead } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [viewModal, setViewModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const messages = contactMessages || [];

    // Calculate statistics
    const totalMessages = messages.length;
    const newMessages = messages.filter(msg => msg.status === 'unread').length;
    const repliedMessages = messages.filter(msg => msg.status === 'replied').length;

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !dateFilter || msg.date?.includes(dateFilter);

        return matchesSearch && matchesDate;
    });

    const handleSelectAll = () => {
        if (selectedMessages.length === filteredMessages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(filteredMessages.map(m => m.id));
        }
    };

    const handleSelectMessage = (id) => {
        setSelectedMessages(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleViewMessage = (msg) => {
        if (msg.status === 'unread') {
            markMessageAsRead(msg.id);
        }
        setViewModal(msg);
    };

    const handleDeleteConfirm = () => {
        if (deleteModal) {
            deleteContactMessage(deleteModal.id);
            setDeleteModal(null);
        }
    };

    return (
        <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', padding: '24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
                        Contact
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Welcome back, Super Admin</p>
                </div>

                {/* Statistics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    {/* Total Messages */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Total Messages</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>{totalMessages}</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Mail size={24} color="#6B7280" />
                        </div>
                    </div>

                    {/* New Messages */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>New Messages</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>{newMessages}</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Clock size={24} color="#6B7280" />
                        </div>
                    </div>

                    {/* Replied */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Replied</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>{repliedMessages}</div>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckSquare size={24} color="#6B7280" />
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={() => { setSearchQuery(''); setDateFilter(''); }}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>

                {/* Messages Table */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                                        onChange={handleSelectAll}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>User</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Subject</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                                <tr key={msg.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '16px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedMessages.includes(msg.id)}
                                            onChange={() => handleSelectMessage(msg.id)}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                        {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#1F2937' }}>
                                        <div style={{ fontWeight: 500 }}>{msg.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{msg.email}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#1F2937' }}>
                                        {msg.subject || msg.message.substring(0, 50) + '...'}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            backgroundColor: msg.status === 'unread' ? '#FEF3C7' : '#D1FAE5',
                                            color: msg.status === 'unread' ? '#92400E' : '#065F46'
                                        }}>
                                            {msg.status === 'unread' ? 'New' : 'Read'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleViewMessage(msg)}
                                                style={{
                                                    padding: '6px 16px',
                                                    backgroundColor: '#3B82F6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal(msg)}
                                                style={{
                                                    padding: '6px 16px',
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px' }}>No messages found</div>
                                        <div style={{ fontSize: '0.875rem' }}>Try adjusting your search or filters</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Message Modal */}
            {viewModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F2937' }}>Message Details</h3>
                            <button
                                onClick={() => setViewModal(null)}
                                style={{
                                    padding: '4px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6B7280'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</label>
                                <div style={{ fontSize: '1rem', color: '#1F2937', marginTop: '4px' }}>{viewModal.name}</div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                                <div style={{ fontSize: '1rem', color: '#3B82F6', marginTop: '4px' }}>{viewModal.email}</div>
                            </div>

                            {viewModal.phone && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label>
                                    <div style={{ fontSize: '1rem', color: '#1F2937', marginTop: '4px' }}>{viewModal.phone}</div>
                                </div>
                            )}

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                                <div style={{ fontSize: '1rem', color: '#1F2937', marginTop: '4px' }}>
                                    {new Date(viewModal.date).toLocaleString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {viewModal.subject && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
                                    <div style={{ fontSize: '1rem', color: '#1F2937', marginTop: '4px' }}>{viewModal.subject}</div>
                                </div>
                            )}

                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
                                <div style={{
                                    fontSize: '1rem',
                                    color: '#1F2937',
                                    marginTop: '8px',
                                    padding: '16px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '8px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {viewModal.message}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                onClick={() => setViewModal(null)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Close
                            </button>
                            <a
                                href={`mailto:${viewModal.email}?subject=Re: ${viewModal.subject || 'Your message'}`}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#3B82F6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    display: 'inline-block'
                                }}
                            >
                                Reply via Email
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '100%',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #E5E7EB'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F2937' }}>Delete Message</h3>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px' }}>
                            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
                                Are you sure you want to delete this message from <strong>{deleteModal.name}</strong>? This action cannot be undone.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '16px 24px',
                            borderTop: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            <button
                                onClick={() => setDeleteModal(null)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContactMessages;
