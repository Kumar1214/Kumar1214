import React, { useState } from 'react';
import { Search, Filter, Check, X, Trash2, Eye, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { useData } from '../../context/useData';

const AdminAdvertisement = () => {
    const { advertisements, updateAdvertisement, deleteAdvertisement } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedAd, setSelectedAd] = useState(null);

    const filteredAds = (advertisements || []).filter(ad => {
        const matchesSearch = (ad.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ad.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ad.email?.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = (ad, newStatus) => {
        updateAdvertisement(ad.id, { ...ad, status: newStatus });
    };

    const handleDelete = (ad) => {
        if (window.confirm(`Delete advertisement request from "${ad.businessName}"?`)) {
            deleteAdvertisement(ad.id);
            if (selectedAd?.id === ad.id) setSelectedAd(null);
        }
    };

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Advertisement Requests
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage advertising inquiries and campaigns</p>
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
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth > 768 ? '400px' : '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
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

                    {/* Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Filter size={18} color="#6B7280" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: '10px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 400px' : '1fr', gap: '24px' }}>
                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredAds.length > 0 ? (
                            filteredAds.map(ad => (
                                <div
                                    key={ad.id}
                                    onClick={() => setSelectedAd(ad)}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        border: selectedAd?.id === ad.id ? '2px solid #F97316' : '1px solid #E5E7EB',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                                                {ad.businessName}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                                {ad.contactPerson} • {ad.package}
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: ad.status === 'approved' ? '#DEF7EC' : ad.status === 'rejected' ? '#FDE8E8' : '#FEF3C7',
                                            color: ad.status === 'approved' ? '#03543F' : ad.status === 'rejected' ? '#9B1C1C' : '#92400E'
                                        }}>
                                            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} /> {new Date(ad.date).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={14} /> {ad.email}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', backgroundColor: 'white', borderRadius: '12px' }}>
                                No requests found
                            </div>
                        )}
                    </div>

                    {/* Detail View (Sticky on Desktop) */}
                    {selectedAd && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            height: 'fit-content',
                            position: window.innerWidth > 1024 ? 'sticky' : 'static',
                            top: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>Request Details</h2>
                                <button
                                    onClick={() => setSelectedAd(null)}
                                    style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Business</label>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>{selectedAd.businessName}</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Contact</label>
                                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
                                            <Users size={16} /> {selectedAd.contactPerson}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
                                            <Mail size={16} /> {selectedAd.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
                                            <Phone size={16} /> {selectedAd.phone}
                                        </div>
                                        {selectedAd.website && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
                                                <Globe size={16} />
                                                <a href={selectedAd.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', textDecoration: 'none' }}>
                                                    {selectedAd.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Package</label>
                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#9333EA' }}>{selectedAd.package}</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Message</label>
                                    <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5, marginTop: '4px', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px' }}>
                                        {selectedAd.description || 'No message provided.'}
                                    </p>
                                </div>

                                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '10px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Actions</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAd, 'approved')}
                                            disabled={selectedAd.status === 'approved'}
                                            style={{
                                                padding: '10px',
                                                backgroundColor: '#059669',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                cursor: selectedAd.status === 'approved' ? 'not-allowed' : 'pointer',
                                                opacity: selectedAd.status === 'approved' ? 0.5 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedAd, 'rejected')}
                                            disabled={selectedAd.status === 'rejected'}
                                            style={{
                                                padding: '10px',
                                                backgroundColor: '#DC2626',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                cursor: selectedAd.status === 'rejected' ? 'not-allowed' : 'pointer',
                                                opacity: selectedAd.status === 'rejected' ? 0.5 : 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <X size={16} /> Reject
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedAd)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            backgroundColor: 'white',
                                            color: '#DC2626',
                                            border: '1px solid #FCA5A5',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAdvertisement;
