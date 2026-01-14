import React, { useState } from 'react';
import { Search, Filter, Check, X, MoreVertical, Eye, Plus } from 'lucide-react';
import Button from '../../components/Button';

const AdminVendorManagement = () => {
    // Mock Vendor Data
    const [vendors, setVendors] = useState([
        { id: 1, name: 'Organic Farms India', email: 'contact@organicfarms.in', status: 'active', products: 45, sales: '₹1,25,000', joined: '2023-09-15' },
        { id: 2, name: 'Vedic Ghee Co.', email: 'support@vedicghee.com', status: 'pending', products: 0, sales: '₹0', joined: '2023-11-20' },
        { id: 3, name: 'Desi Cow Products', email: 'info@desicow.com', status: 'active', products: 12, sales: '₹45,000', joined: '2023-10-05' },
        { id: 4, name: 'Gau Seva Kendra', email: 'help@gauseva.org', status: 'suspended', products: 8, sales: '₹12,500', joined: '2023-08-12' },
    ]);

    const [showAddVendorModal, setShowAddVendorModal] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        address: ''
    });

    const handleStatusChange = (id, newStatus) => {
        setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };

    const handleAddVendor = (e) => {
        e.preventDefault();
        const vendor = {
            id: vendors.length + 1,
            name: newVendor.businessName,
            email: newVendor.email,
            status: 'pending',
            products: 0,
            sales: '₹0',
            joined: new Date().toISOString().split('T')[0]
        };
        setVendors([...vendors, vendor]);
        setShowAddVendorModal(false);
        setNewVendor({ name: '', email: '', phone: '', businessName: '', address: '' });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1F2937' }}>Vendor Management</h1>
                <button
                    onClick={() => setShowAddVendorModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                    <Plus size={20} /> Add Vendor
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Total Vendors</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{vendors.length}</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Pending Approval</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
                            {vendors.filter(v => v.status === 'pending').length}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        />
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer' }}>
                        <Filter size={20} /> Filter
                    </button>
                </div>

                {/* Vendors Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Vendor Name</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Email</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Status</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Products</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Total Sales</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Joined</th>
                            <th style={{ padding: '12px', color: '#6B7280', fontWeight: 500 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '12px', fontWeight: 600 }}>{vendor.name}</td>
                                <td style={{ padding: '12px', color: '#6B7280' }}>{vendor.email}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        backgroundColor:
                                            vendor.status === 'active' ? '#D1FAE5' :
                                                vendor.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                                        color:
                                            vendor.status === 'active' ? '#059669' :
                                                vendor.status === 'pending' ? '#D97706' : '#DC2626'
                                    }}>
                                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>{vendor.products}</td>
                                <td style={{ padding: '12px', fontWeight: 600 }}>{vendor.sales}</td>
                                <td style={{ padding: '12px', color: '#6B7280' }}>{vendor.joined}</td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {vendor.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(vendor.id, 'active')}
                                                    title="Approve"
                                                    style={{ padding: '6px', border: 'none', background: '#D1FAE5', borderRadius: '4px', cursor: 'pointer', color: '#059669' }}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(vendor.id, 'rejected')}
                                                    title="Reject"
                                                    style={{ padding: '6px', border: 'none', background: '#FEE2E2', borderRadius: '4px', cursor: 'pointer', color: '#DC2626' }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                        {vendor.status === 'active' && (
                                            <button
                                                onClick={() => handleStatusChange(vendor.id, 'suspended')}
                                                title="Suspend"
                                                style={{ padding: '6px', border: 'none', background: '#FEE2E2', borderRadius: '4px', cursor: 'pointer', color: '#DC2626' }}
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                        {vendor.status === 'suspended' && (
                                            <button
                                                onClick={() => handleStatusChange(vendor.id, 'active')}
                                                title="Reactivate"
                                                style={{ padding: '6px', border: 'none', background: '#D1FAE5', borderRadius: '4px', cursor: 'pointer', color: '#059669' }}
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                        <button title="View Details" style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Vendor Modal */}
            {showAddVendorModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '500px', maxWidth: '90vw' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Add New Vendor</h2>
                        <form onSubmit={handleAddVendor} style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Business Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newVendor.businessName}
                                    onChange={e => setNewVendor({ ...newVendor, businessName: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Contact Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newVendor.email}
                                    onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={newVendor.phone}
                                    onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Address</label>
                                <textarea
                                    value={newVendor.address}
                                    onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                                    rows={3}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddVendorModal(false)}
                                    style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendorManagement;
