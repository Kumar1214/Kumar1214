import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Globe, Users, Calendar, Image as ImageIcon, Package, FileDown, X } from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader';
import { useData } from '../../../context/useData';

const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
        return JSON.parse(field);
    } catch (e) {
        console.error("Error parsing array field:", e);
        return [];
    }
};

const AdminGaushalaManagement = () => {
    // Safety check for gaushala data
    const { gaushalas: rawGaushalas, addGaushalas, deleteGaushalas, updateGaushalas } = useData();
    const gaushalas = rawGaushalas || [];

    const [showModal, setShowModal] = useState(false);
    const [editingGaushala, setEditingGaushala] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        cows: 0,
        staff: 0,
        established: '',
        description: '',
        timings: '',
        services: [],

        achievements: [],
        image: '',
        gallery: [],
        status: 'active',
        latitude: '',
        longitude: ''
    });

    const [serviceInput, setServiceInput] = useState('');
    const [achievementInput, setAchievementInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            cows: parseInt(formData.cows) || 0,
            staff: parseInt(formData.staff) || 0
        };

        if (editingGaushala) {
            updateGaushalas(editingGaushala.id, dataToSubmit);
        } else {
            addGaushalas(dataToSubmit);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            city: '',
            state: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            cows: 0,
            staff: 0,
            established: '',
            description: '',
            timings: '',
            services: [],

            achievements: [],
            image: '',
            gallery: [],
            status: 'active',
            latitude: '',
            longitude: ''
        });
        setServiceInput('');
        setEditingGaushala(null);
        setShowModal(false);
    };

    const handleEdit = (gaushala) => {
        setEditingGaushala(gaushala);
        setFormData({
            ...gaushala,
            services: parseArrayField(gaushala.services),
            achievements: parseArrayField(gaushala.achievements),
            gallery: parseArrayField(gaushala.gallery)
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this Gaushala?')) {
            deleteGaushalas(id);
        }
    };

    const addService = () => {
        if (serviceInput.trim()) {
            const currentServices = parseArrayField(formData.services);
            setFormData({ ...formData, services: [...currentServices, serviceInput.trim()] });
            setServiceInput('');
        }
    };

    const removeService = (index) => {
        const currentServices = parseArrayField(formData.services);
        setFormData({ ...formData, services: currentServices.filter((_, i) => i !== index) });
    };

    const addAchievement = () => {
        if (achievementInput.trim()) {
            const currentAchievements = parseArrayField(formData.achievements);
            setFormData({ ...formData, achievements: [...currentAchievements, achievementInput.trim()] });
            setAchievementInput('');
        }
    };

    const removeAchievement = (index) => {
        const currentAchievements = parseArrayField(formData.achievements);
        setFormData({ ...formData, achievements: currentAchievements.filter((_, i) => i !== index) });
    };

    const downloadSampleCsv = () => {
        const headers = ['name', 'city', 'state', 'address', 'latitude', 'longitude', 'phone', 'email', 'website', 'cows', 'staff', 'established', 'description', 'timings', 'services', 'achievements', 'image', 'gallery'];
        const sampleRow = ['Sample Gaushala', 'Mathura', 'UP', '123 Krishna Rd', '27.4924', '77.6737', '9876543210', 'email@example.com', 'www.example.com', '100', '10', '2010', 'Sample Description', '6AM-6PM', 'Service1;Service2', 'Award 2023;Best Care', 'http://image.url', 'http://img1.url;http://img2.url'];
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), sampleRow.join(',')].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "gaushala_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                const imported = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',').map(v => v.trim());
                        // Basic validation - check if name exists
                        if (values[0]) {
                            const gaushala = {
                                name: values[0] || '',
                                city: values[1] || '',
                                state: values[2] || '',
                                address: values[3] || '',
                                latitude: values[4] || '',
                                longitude: values[5] || '',
                                phone: values[6] || '',
                                email: values[7] || '',
                                website: values[8] || '',
                                cows: parseInt(values[9]) || 0,
                                staff: parseInt(values[10]) || 0,
                                established: values[11] || '',
                                description: values[12] || '',
                                timings: values[13] || '',
                                services: values[14] ? values[14].split(';').map(s => s.trim()) : [],
                                achievements: values[15] ? values[15].split(';').map(s => s.trim()) : [],
                                image: values[16] || '',
                                gallery: values[17] ? values[17].split(';').map(s => s.trim()) : [],
                                status: 'active'
                            };
                            imported.push(gaushala);
                        }
                    }
                }

                if (imported.length > 0) {
                    imported.forEach(g => addGaushalas(g));
                    alert(`Successfully imported ${imported.length} gaushalas!`);
                }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                            Gaushala Management
                        </h1>
                        <p style={{ color: '#6B7280' }}>Manage Gaushala listings and information</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={downloadSampleCsv}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <FileDown size={18} />
                            Sample CSV
                        </button>
                        <input
                            type="file"
                            accept=".csv"
                            id="csv-upload"
                            style={{ display: 'none' }}
                            onChange={handleCsvUpload}
                        />
                        <button
                            onClick={() => document.getElementById('csv-upload').click()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Package size={18} />
                            Import CSV
                        </button>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#F97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Plus size={18} />
                            Add Gaushala
                        </button>
                    </div>
                </div>

                {/* Gaushalas Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '24px'
                }}>
                    {gaushalas.map(gaushala => (
                        <div
                            key={gaushala.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                height: '200px',
                                backgroundImage: `url(${gaushala.image || 'https://via.placeholder.com/400x200?text=No+Image'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: gaushala.status === 'active' ? '#10B981' : '#9CA3AF',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {gaushala.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                                    {gaushala.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.875rem', marginBottom: '16px' }}>
                                    <MapPin size={14} />
                                    {gaushala.city}, {gaushala.state}
                                </div>

                                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
                                    {gaushala.description}
                                </p>

                                {/* Stats */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    padding: '16px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F97316' }}>{gaushala.cows}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Cows</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>{gaushala.staff}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Staff</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3B82F6' }}>{gaushala.established}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Est.</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleEdit(gaushala)}
                                        style={{ flex: 1, padding: '10px', backgroundColor: '#3B82F615', color: '#3B82F6', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(gaushala.id)}
                                        style={{ flex: 1, padding: '10px', backgroundColor: '#EF444415', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        padding: '32px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}>
                        <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                                {editingGaushala ? 'Edit Gaushala' : 'Add New Gaushala'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            {/* Basic Info */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Gaushala Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Address *
                                </label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows="2"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        placeholder="e.g. 27.4924"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        placeholder="e.g. 77.6737"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 640 ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Number of Cows *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.cows}
                                        onChange={(e) => setFormData({ ...formData, cows: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Staff Members *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.staff}
                                        onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Established Year *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.established}
                                        onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                                        placeholder="2010"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Timings
                                </label>
                                <input
                                    type="text"
                                    value={formData.timings}
                                    onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                                    placeholder="6:00 AM - 7:00 PM"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                />
                            </div>

                            {/* Services */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Services
                                </label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                                        placeholder="Add service..."
                                        style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addService}
                                        style={{ padding: '10px 16px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {parseArrayField(formData.services).map((service, idx) => (
                                        <span key={idx} style={{ padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', items: 'center', gap: '6px' }}>
                                            {service}
                                            <button type="button" onClick={() => removeService(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#92400E' }}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>


                            {/* Achievements */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Achievements
                                </label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        value={achievementInput}
                                        onChange={(e) => setAchievementInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                        placeholder="Add achievement..."
                                        style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addAchievement}
                                        style={{ padding: '10px 16px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {parseArrayField(formData.achievements).map((achievement, idx) => (
                                        <span key={idx} style={{ padding: '6px 12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', items: 'center', gap: '6px' }}>
                                            {achievement}
                                            <button type="button" onClick={() => removeAchievement(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#065F46' }}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Main Image
                                </label>
                                <ImageUploader
                                    label="Upload Main Image"
                                    value={formData.image ? [formData.image] : []}
                                    onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                                />
                            </div>
                            <div>
                                <ImageUploader
                                    label="Gallery Images"
                                    multiple
                                    value={formData.gallery || []}
                                    onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={resetForm} style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>{editingGaushala ? 'Update Gaushala' : 'Add Gaushala'}</button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default AdminGaushalaManagement;
