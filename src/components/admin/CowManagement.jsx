import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Filter, Heart, DollarSign, Calendar } from 'lucide-react';
import { contentService } from '../../services/api';

const CowManagement = () => {
    const [cows, setCows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCowModal, setShowCowModal] = useState(false);
    const [editingCow, setEditingCow] = useState(null);
    const [adoptions, setAdoptions] = useState([]);

    const [newCow, setNewCow] = useState({
        name: '',
        breed: '',
        age: '',
        gender: 'Female',
        color: '',
        description: '',
        healthStatus: 'Good',
        currentLocation: '',
        adoptionStatus: 'available',
        monthlyCost: '',
        gaushala: '',
        gaushalaName: '',
        gaushalaLocation: '',
        milkProduction: '',
        temperament: 'Calm',
        vaccinated: false,
        image: ''
    });

    const fetchCows = useCallback(async () => {
        setLoading(true);
        try {
            const response = await contentService.getCows({ limit: 100 });
            if (response.data.success) {
                setCows(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching cows:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCows();
    }, [fetchCows]);

    const handleCowSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCow) {
                await contentService.updateCow(editingCow.id || editingCow.id, newCow);
                alert('Cow updated successfully!');
            } else {
                await contentService.createCow(newCow);
                alert('Cow created successfully!');
            }
            fetchCows();
            setShowCowModal(false);
            setEditingCow(null);
            resetCowForm();
        } catch (error) {
            console.error("Error saving cow:", error);
            alert("Failed to save cow.");
        }
    };

    const resetCowForm = () => {
        setNewCow({
            name: '',
            breed: '',
            age: '',
            gender: 'Female',
            color: '',
            description: '',
            healthStatus: 'Good',
            currentLocation: '',
            adoptionStatus: 'available',
            monthlyCost: '',
            gaushala: '',
            gaushalaName: '',
            gaushalaLocation: '',
            milkProduction: '',
            temperament: 'Calm',
            vaccinated: false,
            image: ''
        });
        setEditingCow(null);
    };

    const handleEdit = (cow) => {
        setEditingCow(cow);
        setNewCow({
            ...cow,
            age: cow.age?.toString() || '',
            monthlyCost: cow.monthlyCost?.toString() || ''
        });
        setShowCowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this cow?")) {
            try {
                await contentService.deleteCow(id);
                fetchCows();
            } catch (error) {
                console.error("Error deleting cow:", error);
                alert("Failed to delete cow.");
            }
        }
    };

    const handleAdopt = async (id) => {
        if (window.confirm("Are you sure you want to mark this cow as adopted?")) {
            try {
                const response = await contentService.adoptCow(id);
                if (response.data.success) {
                    alert(response.data.message);
                    fetchCows();
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Error adopting cow:", error);
                alert("Failed to adopt cow.");
            }
        }
    };

    return (
        <div>
            {/* Cows Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Cow Inventory ({cows.length} cows)</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={16} /> Filter
                        </button>
                        <button onClick={() => { resetCowForm(); setShowCowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                            <Plus size={18} /> Add Cow
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading Cows...</div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {cows.map(cow => (
                            <div key={cow.id || cow.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                                    <img src={cow.image || 'https://via.placeholder.com/60'} alt={cow.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{cow.name}</h4>
                                        <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                            <span>{cow.breed}</span>
                                            <span>•</span>
                                            <span>{cow.age} years</span>
                                            <span>•</span>
                                            <span>{cow.gender}</span>
                                            <span>•</span>
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: cow.adoptionStatus === 'available' ? '#D1FAE5' : cow.adoptionStatus === 'adopted' ? '#BFDBFE' : '#FEF3C7', color: cow.adoptionStatus === 'available' ? '#065F46' : cow.adoptionStatus === 'adopted' ? '#1D4ED8' : '#92400E', fontSize: '0.75rem' }}>
                                                {cow.adoptionStatus}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem', marginTop: '4px' }}>
                                            <span><Heart size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {cow.healthStatus}</span>
                                            <span>•</span>
                                            <span><DollarSign size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> ₹{cow.monthlyCost}/month</span>
                                            <span>•</span>
                                            <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {cow.gaushalaName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {cow.adoptionStatus === 'available' && (
                                        <button onClick={() => handleAdopt(cow.id || cow.id)} style={{ padding: '8px', border: '1px solid #10B981', color: '#10B981', borderRadius: '4px', cursor: 'pointer', background: '#ECFDF5' }}>
                                            Adopt
                                        </button>
                                    )}
                                    <button onClick={() => handleEdit(cow)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(cow.id || cow.id)} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Cow Modal */}
            <div className={`modal ${showCowModal ? 'show' : ''}`} style={{ display: showCowModal ? 'block' : 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, overflowY: 'auto' }}>
                <div className="modal-content" style={{ backgroundColor: 'white', margin: '5% auto', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>{editingCow ? 'Edit Cow' : 'Add New Cow'}</h3>
                        <button onClick={() => setShowCowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form onSubmit={handleCowSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Name *</label>
                                <input type="text" required value={newCow.name} onChange={e => setNewCow({ ...newCow, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Breed *</label>
                                <input type="text" required value={newCow.breed} onChange={e => setNewCow({ ...newCow, breed: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Age (years) *</label>
                                <input type="number" min="0" required value={newCow.age} onChange={e => setNewCow({ ...newCow, age: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Gender *</label>
                                <select value={newCow.gender} onChange={e => setNewCow({ ...newCow, gender: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Color</label>
                                <input type="text" value={newCow.color} onChange={e => setNewCow({ ...newCow, color: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Health Status</label>
                                <select value={newCow.healthStatus} onChange={e => setNewCow({ ...newCow, healthStatus: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Temperament</label>
                                <select value={newCow.temperament} onChange={e => setNewCow({ ...newCow, temperament: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                                    <option value="Calm">Calm</option>
                                    <option value="Active">Active</option>
                                    <option value="Friendly">Friendly</option>
                                    <option value="Shy">Shy</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Current Location *</label>
                                <input type="text" required value={newCow.currentLocation} onChange={e => setNewCow({ ...newCow, currentLocation: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Monthly Cost (₹) *</label>
                                <input type="number" min="0" required value={newCow.monthlyCost} onChange={e => setNewCow({ ...newCow, monthlyCost: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Adoption Status</label>
                                <select value={newCow.adoptionStatus} onChange={e => setNewCow({ ...newCow, adoptionStatus: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                                    <option value="available">Available</option>
                                    <option value="adopted">Adopted</option>
                                    <option value="sponsored">Sponsored</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Vaccinated</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={newCow.vaccinated} 
                                        onChange={e => setNewCow({ ...newCow, vaccinated: e.target.checked })} 
                                        style={{ width: '18px', height: '18px' }} 
                                    />
                                    <span>Vaccination Status</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Milk Production</label>
                            <input type="text" value={newCow.milkProduction} onChange={e => setNewCow({ ...newCow, milkProduction: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} placeholder="e.g., 8 liters/day" />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description *</label>
                            <textarea
                                value={newCow.description}
                                onChange={(e) => setNewCow({ ...newCow, description: e.target.value })}
                                rows={3}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit', resize: 'vertical' }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Image URL</label>
                            <input type="text" value={newCow.image} onChange={e => setNewCow({ ...newCow, image: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} placeholder="https://example.com/image.jpg" />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                            <button type="button" onClick={() => setShowCowModal(false)} style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {editingCow ? 'Update Cow' : 'Add Cow'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CowManagement;