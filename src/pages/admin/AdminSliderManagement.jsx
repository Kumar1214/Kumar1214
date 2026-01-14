import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, ExternalLink, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useData } from '../../context/useData';
import ImageUploader from '../../components/ImageUploader';

const AdminSliderManagement = () => {
    const { homeSliders, addHomeSlider, deleteHomeSlider, updateHomeSlider } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
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

    const filteredSliders = (homeSliders || [])
        .filter(slider =>
            (filterLocation === 'all' || slider.location === filterLocation) &&
            (slider.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                slider.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    const sortedSliders = [...filteredSliders].sort((a, b) => (a.order || 0) - (b.order || 0));

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
        setEditingSlider(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSlider) {
            updateHomeSlider(editingSlider.id, formData);
        } else {
            addHomeSlider(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (slider) => {
        setEditingSlider(slider);
        setFormData({
            title: slider.title || '',
            subtitle: slider.subtitle || '',
            description: slider.description || '',
            image: slider.image || '',
            buttonText: slider.buttonText || '',
            buttonLink: slider.buttonLink || '',
            order: slider.order || 1,
            active: slider.active !== undefined ? slider.active : true
        });
        setShowModal(true);
    };

    const handleDelete = (slider) => {
        if (window.confirm(`Delete slider "${slider.title}"?`)) {
            deleteHomeSlider(slider.id);
        }
    };

    const handleToggleActive = (slider) => {
        updateHomeSlider(slider.id, { ...slider, active: !slider.active });
    };

    const moveSlider = (slider, direction) => {
        const currentIndex = sortedSliders.findIndex(s => s.id === slider.id);
        if (direction === 'up' && currentIndex > 0) {
            const prevSlider = sortedSliders[currentIndex - 1];
            updateHomeSlider(slider.id, { ...slider, order: prevSlider.order });
            updateHomeSlider(prevSlider.id, { ...prevSlider, order: slider.order });
        } else if (direction === 'down' && currentIndex < sortedSliders.length - 1) {
            const nextSlider = sortedSliders[currentIndex + 1];
            updateHomeSlider(slider.id, { ...slider, order: nextSlider.order });
            updateHomeSlider(nextSlider.id, { ...nextSlider, order: slider.order });
        }
    };

    return (
        <div style={{ padding: window.innerWidth > 768 ? '32px' : '16px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Home Page Sliders
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage homepage banner sliders</p>
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
                            placeholder="Search sliders..."
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

                    {/* Add Button */}
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
                            whiteSpace: 'nowrap',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                    >
                        <Plus size={16} />
                        Add Slider
                    </button>
                </div>

                {/* Sliders Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Id</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Banner</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>URL</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Order</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Location</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSliders.length > 0 ? (
                                    sortedSliders.map((slider) => (
                                        <tr key={slider.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#1F2937' }}>{slider.id}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ width: '120px', height: '60px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                                                    {slider.image ? (
                                                        <img src={slider.image} alt={slider.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#6B7280' }}>
                                                {slider.buttonLink || '-'}
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#1F2937' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {slider.order}
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <button
                                                            onClick={() => moveSlider(slider, 'up')}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
                                                        >
                                                            <ChevronUp size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => moveSlider(slider, 'down')}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
                                                        >
                                                            <ChevronDown size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor: '#3B82F620',
                                                    color: '#3B82F6'
                                                }}>
                                                    {slider.location ? slider.location.charAt(0).toUpperCase() + slider.location.slice(1) : 'Home'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <button
                                                    onClick={() => handleToggleActive(slider)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: slider.active ? '#10B98120' : '#EF444420',
                                                        color: slider.active ? '#10B981' : '#EF4444',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {slider.active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleEdit(slider)}
                                                        style={{
                                                            padding: '8px 16px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '6px',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500,
                                                            color: '#374151',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slider)}
                                                        style={{
                                                            padding: '8px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid #E5E7EB',
                                                            borderRadius: '6px',
                                                            color: '#EF4444',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                <ImageIcon size={40} style={{ opacity: 0.5 }} />
                                                <span>No sliders found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
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
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            {editingSlider ? 'Edit Slider' : 'Add New Slider'}
                        </h2>

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

                            {/* Title */}
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
                                    placeholder="Enter slider title"
                                />
                            </div>

                            {/* Subtitle */}
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
                                    placeholder="Enter slider subtitle"
                                />
                            </div>

                            {/* Banner Image */}
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

                            {/* Button Text & Link */}
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

                            {/* Order & Active */}
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

                            {/* Buttons */}
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
                                    {editingSlider ? 'Update Slider' : 'Add Slider'}
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

export default AdminSliderManagement;
