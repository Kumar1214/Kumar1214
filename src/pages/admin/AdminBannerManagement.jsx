import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useData } from '../../context/useData';
import ImageUploader from '../../components/ImageUploader';

const AdminBannerManagement = () => {
    // Note: This uses the same homeSliders data but with a different filter
    // In production, you might want separate banner data
    const { homeSliders, addHomeSlider, deleteHomeSlider, updateHomeSlider } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [filterLocation, setFilterLocation] = useState('all');

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        order: 1,
        active: true,
        location: 'home'
    });

    // Filter banners (using homeSliders data)
    const filteredBanners = (homeSliders || [])
        .filter(banner =>
            (filterLocation === 'all' || banner.location === filterLocation) &&
            (banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                banner.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    const sortedBanners = [...filteredBanners].sort((a, b) => (a.order || 0) - (b.order || 0));

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            buttonText: '',
            buttonLink: '',
            order: (homeSliders?.length || 0) + 1,
            active: true,
            location: 'home'
        });
        setEditingBanner(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBanner) {
            updateHomeSlider(editingBanner.id, formData);
        } else {
            addHomeSlider(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            image: banner.image || '',
            buttonText: banner.buttonText || '',
            buttonLink: banner.buttonLink || '',
            order: banner.order || 1,
            active: banner.active !== undefined ? banner.active : true,
            location: banner.location || 'home'
        });
        setShowModal(true);
    };

    const handleDelete = (banner) => {
        if (window.confirm(`Delete banner "${banner.title}"?`)) {
            deleteHomeSlider(banner.id);
        }
    };

    const handleToggleActive = (banner) => {
        updateHomeSlider(banner.id, { ...banner, active: !banner.active });
    };

    const moveBanner = (banner, direction) => {
        const currentIndex = sortedBanners.findIndex(s => s.id === banner.id);
        if (direction === 'up' && currentIndex > 0) {
            const prevBanner = sortedBanners[currentIndex - 1];
            updateHomeSlider(banner.id, { ...banner, order: prevBanner.order });
            updateHomeSlider(prevBanner.id, { ...prevBanner, order: banner.order });
        } else if (direction === 'down' && currentIndex < sortedBanners.length - 1) {
            const nextBanner = sortedBanners[currentIndex + 1];
            updateHomeSlider(banner.id, { ...banner, order: nextBanner.order });
            updateHomeSlider(nextBanner.id, { ...nextBanner, order: banner.order });
        }
    };

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Banner Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage promotional banners across the platform</p>
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
                            placeholder="Search banners..."
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

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                            style={{
                                padding: '10px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Locations</option>
                            <option value="home">Home Page</option>
                            <option value="courses">Courses Page</option>
                            <option value="shop">Shop Page</option>
                        </select>

                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Plus size={16} />
                            Add Banner
                        </button>
                    </div>
                </div>

                {/* Banners Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(2, 1fr)' : '1fr', gap: '24px' }}>
                    {sortedBanners.map((banner) => (
                        <div key={banner.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                            {/* Banner Image */}
                            <div style={{ width: '100%', height: '200px', backgroundColor: '#F3F4F6', position: 'relative' }}>
                                {banner.image ? (
                                    <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    display: 'flex',
                                    gap: '8px'
                                }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: '#3B82F620',
                                        color: '#3B82F6'
                                    }}>
                                        {banner.location ? banner.location.charAt(0).toUpperCase() + banner.location.slice(1) : 'Home'}
                                    </span>
                                    <button
                                        onClick={() => handleToggleActive(banner)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: banner.active ? '#10B98120' : '#EF444420',
                                            color: banner.active ? '#10B981' : '#EF4444',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {banner.active ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            {/* Banner Content */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                                        {banner.title}
                                    </h3>
                                    {banner.subtitle && (
                                        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: '1.5' }}>
                                        {banner.description}
                                    </p>
                                </div>

                                {banner.buttonText && (
                                    <div style={{ marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>Button:</div>
                                        <div style={{ fontSize: '0.875rem', color: '#1F2937' }}>
                                            {banner.buttonText} → {banner.buttonLink}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Order: {banner.order}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button
                                                onClick={() => moveBanner(banner, 'up')}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveBanner(banner, 'down')}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            style={{
                                                padding: '8px',
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                color: '#374151',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner)}
                                            style={{
                                                padding: '8px',
                                                backgroundColor: 'white',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                color: '#EF4444',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sortedBanners.length === 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '60px 20px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <ImageIcon size={48} style={{ opacity: 0.5, margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>No banners found</p>
                    </div>
                )}
            </div>

            {/* Banner Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Display Location
                                </label>
                                <select
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="home">Home Page</option>
                                    <option value="courses">Courses Page</option>
                                    <option value="shop">Shop Page</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                    placeholder="Enter banner title"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                    placeholder="Enter banner subtitle"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Enter banner description"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Banner Image *
                                </label>
                                <ImageUploader
                                    label=""
                                    value={formData.image ? [formData.image] : []}
                                    onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        placeholder="Learn More"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Button Link
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        placeholder="/courses"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Status
                                    </label>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: formData.active ? '#10B98110' : '#F3F4F6'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10B981' }}
                                        />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: formData.active ? '#10B981' : '#6B7280' }}>
                                            {formData.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#F3F4F6',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBannerManagement;
