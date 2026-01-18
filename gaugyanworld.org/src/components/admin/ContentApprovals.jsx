import React, { useState } from 'react';
import { useData } from '../../context/useData';
import { CheckCircle, XCircle, Eye, AlertCircle, Edit, Trash2, X, Save, MoreVertical } from 'lucide-react';

const ContentApprovals = () => {
    const {
        courses, updateCourse, deleteCourse,
        products, updateProduct, deleteProduct,
        music, updateMusic, deleteMusic,
        podcasts, updatePodcast, deletePodcast,
        meditation, updateMeditation, deleteMeditation,
        news, updateNews, deleteNews
    } = useData();

    const [activeTab, setActiveTab] = useState('all');
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);

    // Helper to get pending items
    const getPendingItems = (items, type) => {
        if (!items) return [];
        return items.filter(item => item.status !== 'approved' && item.status !== 'published').map(item => ({ ...item, contentType: type }));
    };

    const pendingItems = [
        ...getPendingItems(courses, 'Course'),
        ...getPendingItems(products, 'Product'),
        ...getPendingItems(music, 'Music'),
        ...getPendingItems(podcasts, 'Podcast'),
        ...getPendingItems(meditation, 'Meditation'),
        ...getPendingItems(news, 'News')
    ];

    const filteredItems = activeTab === 'all'
        ? pendingItems
        : pendingItems.filter(item => item.contentType === activeTab);

    const handleApprove = (item) => {
        const updateData = { status: item.contentType === 'News' ? 'published' : 'approved' };
        switch (item.contentType) {
            case 'Course': updateCourse(item.id, updateData); break;
            case 'Product': updateProduct(item.id, updateData); break;
            case 'Music': updateMusic(item.id, updateData); break;
            case 'Podcast': updatePodcast(item.id, updateData); break;
            case 'Meditation': updateMeditation(item.id, updateData); break;
            case 'News': updateNews(item.id, updateData); break;
        }
    };

    const handleDelete = (item) => {
        if (window.confirm('Are you sure you want to reject and delete this item?')) {
            switch (item.contentType) {
                case 'Course': deleteCourse(item.id); break;
                case 'Product': deleteProduct(item.id); break;
                case 'Music': deleteMusic(item.id); break;
                case 'Podcast': deletePodcast(item.id); break;
                case 'Meditation': deleteMeditation(item.id); break;
                case 'News': deleteNews(item.id); break;
            }
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const { contentType, id, ...data } = editItem;
        const updateData = { ...data };
        delete updateData.contentType;

        switch (contentType) {
            case 'Course': updateCourse(id, updateData); break;
            case 'Product': updateProduct(id, updateData); break;
            case 'Music': updateMusic(id, updateData); break;
            case 'Podcast': updatePodcast(id, updateData); break;
            case 'Meditation': updateMeditation(id, updateData); break;
            case 'News': updateNews(id, updateData); break;
        }
        setEditItem(null);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Content Approvals</h2>
                <p style={{ color: '#6B7280' }}>Review and approve content submitted by instructors, artists, and vendors.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['All', 'Course', 'Product', 'Music', 'Podcast', 'Meditation', 'News'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab === 'All' ? 'all' : tab)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            border: (activeTab === 'all' && tab === 'All') || activeTab === tab ? 'none' : '1px solid #E5E7EB',
                            backgroundColor: (activeTab === 'all' && tab === 'All') || activeTab === tab ? 'var(--color-primary)' : 'white',
                            color: (activeTab === 'all' && tab === 'All') || activeTab === tab ? 'white' : '#4B5563',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {tab}
                        {tab === 'All' && pendingItems.length > 0 && (
                            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '10px', fontSize: '0.75rem' }}>{pendingItems.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Grid Layout */}
            {filteredItems.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>All caught up!</h3>
                    <p>No pending content to approve.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredItems.map((item) => (
                        <div key={`${item.contentType}-${item.id}`} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Image Section */}
                            <div style={{ position: 'relative', height: '180px' }}>
                                <img
                                    src={item.image || item.coverArt || item.featuredImage || (item.images && item.images[0]) || 'https://via.placeholder.com/300x200'}
                                    alt={item.title || item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.8rem' }}>
                                        {item.contentType}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.title || item.name}
                                    </h3>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MoreVertical size={16} color="#6B7280" /></button>
                                </div>
                                <div style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    {item.instructor || item.artist || item.vendor || item.author || item.host || 'Unknown User'}
                                </div>

                                {/* Footer Section */}
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Status:</span>
                                        <label className="switch" style={{ transform: 'scale(0.8)' }}>
                                            <input
                                                type="checkbox"
                                                checked={false} // Always unchecked for pending
                                                onChange={() => handleApprove(item)} // Approve on click
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setViewItem(item)} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#6B7280' }} title="View">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => setEditItem({ ...item })} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#3B82F6' }} title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item)} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#EF4444' }} title="Reject">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Modal */}
            {viewItem && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '16px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Content Details</h3>
                            <button onClick={() => setViewItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ aspectRatio: '16/9', backgroundColor: '#F3F4F6', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                                <img
                                    src={viewItem.image || viewItem.coverArt || viewItem.featuredImage || (viewItem.images && viewItem.images[0]) || 'https://via.placeholder.com/600x400'}
                                    alt={viewItem.title || viewItem.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gap: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Title</label>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', margin: 0 }}>{viewItem.title || viewItem.name}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Description</label>
                                    <p style={{ color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{viewItem.description || viewItem.content || 'No description provided.'}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Type</label>
                                        <p style={{ fontWeight: 500, margin: 0 }}>{viewItem.contentType}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Submitted By</label>
                                        <p style={{ fontWeight: 500, margin: 0 }}>{viewItem.instructor || viewItem.artist || viewItem.vendor || viewItem.author || viewItem.host || 'Unknown'}</p>
                                    </div>
                                    {viewItem.price !== undefined && (
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Price</label>
                                            <p style={{ fontWeight: 500, margin: 0 }}>₹{viewItem.price}</p>
                                        </div>
                                    )}
                                    {viewItem.category && (
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Category</label>
                                            <p style={{ fontWeight: 500, margin: 0 }}>{viewItem.category}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                            <button onClick={() => setViewItem(null)} style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #E5E7EB', color: '#374151', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                Close
                            </button>
                            <button onClick={() => { handleApprove(viewItem); setViewItem(null); }} style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={18} /> Approve Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editItem && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '16px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '0' }}>
                        <form onSubmit={handleUpdate}>
                            <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Edit Content</h3>
                                <button type="button" onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Title</label>
                                    <input
                                        type="text"
                                        value={editItem.title || editItem.name || ''}
                                        onChange={(e) => setEditItem({ ...editItem, [editItem.title !== undefined ? 'title' : 'name']: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Description</label>
                                    <textarea
                                        rows="4"
                                        value={editItem.description || editItem.content || ''}
                                        onChange={(e) => setEditItem({ ...editItem, [editItem.description !== undefined ? 'description' : 'content']: e.target.value })}
                                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Category</label>
                                        <input
                                            type="text"
                                            value={editItem.category || ''}
                                            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    {editItem.price !== undefined && (
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Price</label>
                                            <input
                                                type="number"
                                                value={editItem.price}
                                                onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })}
                                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                                <button type="button" onClick={() => setEditItem(null)} style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #E5E7EB', color: '#374151', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentApprovals;
