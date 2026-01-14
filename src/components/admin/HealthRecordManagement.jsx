import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter, Heart, Stethoscope, Calendar } from 'lucide-react';
import { useCows } from '../../hooks/useCows';

const HealthRecordManagement = () => {
    const { cows, updateCow } = useCows();
    const [healthRecords, setHealthRecords] = useState([]);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedCow, setSelectedCow] = useState('');
    const [filter, setFilter] = useState('all');

    const [newRecord, setNewRecord] = useState({
        cowId: '',
        date: '',
        treatment: '',
        veterinarian: '',
        notes: '',
        nextAppointment: ''
    });

    // Extract all health records from cows
    useEffect(() => {
        const allRecords = [];
        cows.forEach(cow => {
            if (cow.healthRecords && cow.healthRecords.length > 0) {
                cow.healthRecords.forEach(record => {
                    allRecords.push({
                        ...record,
                        cowId: cow.id || cow.id,
                        cowName: cow.name,
                        cowBreed: cow.breed
                    });
                });
            }
        });
        setHealthRecords(allRecords);
    }, [cows]);

    const handleRecordSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find the cow to update
            const cowToUpdate = cows.find(cow => cow.id === newRecord.cowId || cow.id === newRecord.cowId);
            if (!cowToUpdate) {
                alert('Cow not found');
                return;
            }

            // Prepare updated health records
            let updatedHealthRecords = [...(cowToUpdate.healthRecords || [])];
            
            if (editingRecord) {
                // Update existing record
                updatedHealthRecords = updatedHealthRecords.map(record => 
                    record.id === editingRecord.id ? { ...newRecord } : record
                );
            } else {
                // Add new record
                const recordToAdd = {
                    ...newRecord,
                    id: Date.now().toString() // Simple ID for new records
                };
                updatedHealthRecords.push(recordToAdd);
            }

            // Update the cow with new health records
            const result = await updateCow(newRecord.cowId, {
                ...cowToUpdate,
                healthRecords: updatedHealthRecords
            });

            if (result.success) {
                alert(editingRecord ? 'Health record updated successfully!' : 'Health record added successfully!');
                resetRecordForm();
                setShowRecordModal(false);
            } else {
                alert(result.message || 'Failed to save health record.');
            }
        } catch (error) {
            console.error("Error saving health record:", error);
            alert("Failed to save health record.");
        }
    };

    const resetRecordForm = () => {
        setNewRecord({
            cowId: selectedCow || '',
            date: '',
            treatment: '',
            veterinarian: '',
            notes: '',
            nextAppointment: ''
        });
        setEditingRecord(null);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setNewRecord({
            ...record,
            cowId: record.cowId || ''
        });
        setSelectedCow(record.cowId || '');
        setShowRecordModal(true);
    };

    const handleDelete = async (recordId, cowId) => {
        if (window.confirm("Are you sure you want to delete this health record?")) {
            try {
                // Find the cow to update
                const cowToUpdate = cows.find(cow => cow.id === cowId || cow.id === cowId);
                if (!cowToUpdate) {
                    alert('Cow not found');
                    return;
                }

                // Remove the record
                const updatedHealthRecords = cowToUpdate.healthRecords.filter(
                    record => record.id !== recordId
                );

                // Update the cow with filtered health records
                const result = await updateCow(cowId, {
                    ...cowToUpdate,
                    healthRecords: updatedHealthRecords
                });

                if (result.success) {
                    alert('Health record deleted successfully!');
                } else {
                    alert(result.message || 'Failed to delete health record.');
                }
            } catch (error) {
                console.error("Error deleting health record:", error);
                alert("Failed to delete health record.");
            }
        }
    };

    const filteredRecords = healthRecords.filter(record => {
        if (filter !== 'all' && record.cowId !== filter) return false;
        return true;
    });

    return (
        <div>
            {/* Health Records Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Health Records ({healthRecords.length} records)</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        >
                            <option value="all">All Cows</option>
                            {cows.map(cow => (
                                <option key={cow.id || cow.id} value={cow.id || cow.id}>
                                    {cow.name} ({cow.breed})
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={() => { resetRecordForm(); setShowRecordModal(true); }} 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        >
                            <Plus size={18} /> Add Record
                        </button>
                    </div>
                </div>

                {filteredRecords.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <Heart size={48} style={{ opacity: 0.5, margin: '0 auto 16px', color: '#9CA3AF' }} />
                        <p style={{ color: '#9CA3AF', fontSize: '1.125rem' }}>No health records found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {filteredRecords.map(record => (
                            <div key={record.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF2F2' }}>
                                        <Stethoscope size={24} style={{ color: '#EF4444' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>
                                            {record.cowName} <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 'normal' }}>({record.cowBreed})</span>
                                        </h4>
                                        <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                            <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {new Date(record.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Treatment: {record.treatment}</span>
                                            <span>•</span>
                                            <span>Veterinarian: {record.veterinarian}</span>
                                        </div>
                                        {record.notes && (
                                            <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#4B5563' }}>
                                                Notes: {record.notes}
                                            </div>
                                        )}
                                        {record.nextAppointment && (
                                            <div style={{ marginTop: '4px', fontSize: '0.9rem', color: '#F59E0B' }}>
                                                Next Appointment: {new Date(record.nextAppointment).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => handleEdit(record)}
                                        style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(record.id, record.cowId)}
                                        style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Health Record Modal */}
            <div className={`modal ${showRecordModal ? 'show' : ''}`} style={{ display: showRecordModal ? 'block' : 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, overflowY: 'auto' }}>
                <div className="modal-content" style={{ backgroundColor: 'white', margin: '5% auto', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>{editingRecord ? 'Edit Health Record' : 'Add New Health Record'}</h3>
                        <button onClick={() => setShowRecordModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form onSubmit={handleRecordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Select Cow *</label>
                            <select
                                value={newRecord.cowId}
                                onChange={(e) => setNewRecord({ ...newRecord, cowId: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="">Select a cow</option>
                                {cows.map(cow => (
                                    <option key={cow.id || cow.id} value={cow.id || cow.id}>
                                        {cow.name} ({cow.breed})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Date *</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={newRecord.date} 
                                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Next Appointment</label>
                                <input 
                                    type="date" 
                                    value={newRecord.nextAppointment} 
                                    onChange={(e) => setNewRecord({ ...newRecord, nextAppointment: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Treatment *</label>
                            <input 
                                type="text" 
                                required 
                                value={newRecord.treatment} 
                                onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })} 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                placeholder="Treatment details"
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Veterinarian *</label>
                            <input 
                                type="text" 
                                required 
                                value={newRecord.veterinarian} 
                                onChange={(e) => setNewRecord({ ...newRecord, veterinarian: e.target.value })} 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                placeholder="Veterinarian name"
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Notes</label>
                            <textarea
                                value={newRecord.notes}
                                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                                rows={3}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit', resize: 'vertical' }}
                                placeholder="Additional notes"
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                            <button type="button" onClick={() => setShowRecordModal(false)} style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {editingRecord ? 'Update Record' : 'Add Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HealthRecordManagement;