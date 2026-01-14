import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, IndianRupee, Calendar, User, TrendingUp } from 'lucide-react';
import { contentService } from '../../services/api';

const DonationTracking = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [editingDonation, setEditingDonation] = useState(null);
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const [newDonation, setNewDonation] = useState({
        donorName: '',
        donorEmail: '',
        amount: '',
        currency: 'INR',
        donationType: 'general',
        gaushala: '',
        purpose: '',
        paymentMethod: 'online',
        status: 'completed',
        notes: ''
    });

    const DONATION_TYPES = [
        { id: 'general', name: 'General Donation' },
        { id: 'cow-adoption', name: 'Cow Adoption' },
        { id: 'medical', name: 'Medical Treatment' },
        { id: 'food', name: 'Food & Nutrition' },
        { id: 'infrastructure', name: 'Infrastructure' },
        { id: 'maintenance', name: 'Maintenance' }
    ];

    const PAYMENT_METHODS = [
        { id: 'online', name: 'Online Payment' },
        { id: 'bank-transfer', name: 'Bank Transfer' },
        { id: 'cash', name: 'Cash' },
        { id: 'cheque', name: 'Cheque' }
    ];

    const GAUSHALAS = [
        { id: 'shri-krishna', name: 'Shri Krishna Gaushala' },
        { id: 'ganga-tier', name: 'Ganga Tier Gaushala' },
        { id: 'surabhi', name: 'Surabhi Seva Kendra' },
        { id: 'kamadhenu', name: 'Kamadhenu Sanctuary' }
    ];

    const fetchDonations = useCallback(async () => {
        setLoading(true);
        try {
            // In a real implementation, this would fetch from an API
            // For now, we'll use mock data
            const mockDonations = [
                {
                    id: 1,
                    donorName: 'Rajesh Sharma',
                    donorEmail: 'rajesh@example.com',
                    amount: 5000,
                    currency: 'INR',
                    donationType: 'cow-adoption',
                    gaushala: 'shri-krishna',
                    purpose: 'Adoption of Gauri cow',
                    paymentMethod: 'online',
                    status: 'completed',
                    date: '2024-11-15',
                    notes: 'Monthly adoption payment'
                },
                {
                    id: 2,
                    donorName: 'Priya Desai',
                    donorEmail: 'priya@example.com',
                    amount: 10000,
                    currency: 'INR',
                    donationType: 'medical',
                    gaushala: 'ganga-tier',
                    purpose: 'Medical treatment for injured cow',
                    paymentMethod: 'bank-transfer',
                    status: 'completed',
                    date: '2024-11-10',
                    notes: 'Emergency treatment'
                },
                {
                    id: 3,
                    donorName: 'Amit Patel',
                    donorEmail: 'amit@example.com',
                    amount: 2500,
                    currency: 'INR',
                    donationType: 'general',
                    gaushala: 'surabhi',
                    purpose: 'General support',
                    paymentMethod: 'online',
                    status: 'pending',
                    date: '2024-11-20',
                    notes: 'Recurring donation'
                }
            ];
            setDonations(mockDonations);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const handleDonationSubmit = async (e) => {
        e.preventDefault();
        try {
            // In a real implementation, this would save to an API
            if (editingDonation) {
                alert('Donation updated successfully!');
            } else {
                alert('Donation recorded successfully!');
            }
            fetchDonations();
            setShowDonationModal(false);
            setEditingDonation(null);
            resetDonationForm();
        } catch (error) {
            console.error("Error saving donation:", error);
            alert("Failed to save donation.");
        }
    };

    const resetDonationForm = () => {
        setNewDonation({
            donorName: '',
            donorEmail: '',
            amount: '',
            currency: 'INR',
            donationType: 'general',
            gaushala: '',
            purpose: '',
            paymentMethod: 'online',
            status: 'completed',
            notes: ''
        });
        setEditingDonation(null);
    };

    const handleEdit = (donation) => {
        setEditingDonation(donation);
        setNewDonation({
            ...donation,
            amount: donation.amount?.toString() || ''
        });
        setShowDonationModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this donation record?")) {
            try {
                // In a real implementation, this would delete from an API
                alert('Donation record deleted successfully!');
                fetchDonations();
            } catch (error) {
                console.error("Error deleting donation:", error);
                alert("Failed to delete donation record.");
            }
        }
    };

    const filteredDonations = donations.filter(donation => {
        if (filter !== 'all' && donation.donationType !== filter) return false;
        if (dateRange.start && new Date(donation.date) < new Date(dateRange.start)) return false;
        if (dateRange.end && new Date(donation.date) > new Date(dateRange.end)) return false;
        return true;
    });

    // Calculate statistics
    const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    const completedDonations = donations.filter(d => d.status === 'completed').reduce((sum, donation) => sum + (donation.amount || 0), 0);
    const pendingDonations = donations.filter(d => d.status === 'pending').reduce((sum, donation) => sum + (donation.amount || 0), 0);

    return (
        <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#EFF6FF' }}>
                            <IndianRupee size={24} style={{ color: '#3B82F6' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Total Donations</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalDonations.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#ECFDF5' }}>
                            <TrendingUp size={24} style={{ color: '#10B981' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Completed</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{completedDonations.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className="card" style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEF3C7' }}>
                            <Calendar size={24} style={{ color: '#F59E0B' }} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Pending</h4>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{pendingDonations.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                    >
                        <option value="all">All Types</option>
                        {DONATION_TYPES.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                    
                    <input 
                        type="date" 
                        value={dateRange.start} 
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        placeholder="Start Date"
                    />
                    
                    <input 
                        type="date" 
                        value={dateRange.end} 
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        placeholder="End Date"
                    />
                </div>
                
                <button 
                    onClick={() => { resetDonationForm(); setShowDonationModal(true); }} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                    <Plus size={18} /> Record Donation
                </button>
            </div>

            {/* Donations Table */}
            <div className="card" style={{ borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                    <h3>Donation Records ({filteredDonations.length})</h3>
                </div>
                
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading Donations...</div>
                ) : filteredDonations.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No donations found</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Donor</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Amount</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Type</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Gaushala</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Date</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '12px 20px', borderBottom: '1px solid #E5E7EB', fontWeight: 600 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonations.map(donation => (
                                    <tr key={donation.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{donation.donorName}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{donation.donorEmail}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 600 }}>₹{donation.amount?.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{donation.paymentMethod}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {DONATION_TYPES.find(t => t.id === donation.donationType)?.name || donation.donationType}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {GAUSHALAS.find(g => g.id === donation.gaushala)?.name || donation.gaushala}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                                                <Calendar size={14} />
                                                {new Date(donation.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '16px', 
                                                fontSize: '0.8rem', 
                                                fontWeight: 500,
                                                backgroundColor: donation.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                                                color: donation.status === 'completed' ? '#065F46' : '#92400E'
                                            }}>
                                                {donation.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleEdit(donation)}
                                                    style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(donation.id)}
                                                    style={{ padding: '6px 10px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Donation Modal */}
            <div className={`modal ${showDonationModal ? 'show' : ''}`} style={{ display: showDonationModal ? 'block' : 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, overflowY: 'auto' }}>
                <div className="modal-content" style={{ backgroundColor: 'white', margin: '5% auto', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>{editingDonation ? 'Edit Donation' : 'Record New Donation'}</h3>
                        <button onClick={() => setShowDonationModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                    </div>
                    <form onSubmit={handleDonationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Donor Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newDonation.donorName} 
                                    onChange={e => setNewDonation({ ...newDonation, donorName: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Donor Email *</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={newDonation.donorEmail} 
                                    onChange={e => setNewDonation({ ...newDonation, donorEmail: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                />
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Amount (₹) *</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    required 
                                    value={newDonation.amount} 
                                    onChange={e => setNewDonation({ ...newDonation, amount: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Donation Type *</label>
                                <select 
                                    value={newDonation.donationType} 
                                    onChange={e => setNewDonation({ ...newDonation, donationType: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                >
                                    {DONATION_TYPES.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Gaushala</label>
                                <select 
                                    value={newDonation.gaushala} 
                                    onChange={e => setNewDonation({ ...newDonation, gaushala: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                >
                                    <option value="">Select Gaushala</option>
                                    {GAUSHALAS.map(gaushala => (
                                        <option key={gaushala.id} value={gaushala.id}>{gaushala.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Payment Method</label>
                                <select 
                                    value={newDonation.paymentMethod} 
                                    onChange={e => setNewDonation({ ...newDonation, paymentMethod: e.target.value })} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                >
                                    {PAYMENT_METHODS.map(method => (
                                        <option key={method.id} value={method.id}>{method.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Purpose</label>
                            <input 
                                type="text" 
                                value={newDonation.purpose} 
                                onChange={e => setNewDonation({ ...newDonation, purpose: e.target.value })} 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} 
                                placeholder="Purpose of donation"
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Status</label>
                            <select 
                                value={newDonation.status} 
                                onChange={e => setNewDonation({ ...newDonation, status: e.target.value })} 
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                            >
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Notes</label>
                            <textarea
                                value={newDonation.notes}
                                onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                                rows={3}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit', resize: 'vertical' }}
                                placeholder="Additional notes"
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                            <button type="button" onClick={() => setShowDonationModal(false)} style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {editingDonation ? 'Update Donation' : 'Record Donation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DonationTracking;