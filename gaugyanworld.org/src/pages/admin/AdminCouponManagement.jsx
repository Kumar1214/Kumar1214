import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Percent, Copy, CheckCircle, XCircle, Search } from 'lucide-react';

const AdminCouponManagement = () => {
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            code: 'WELCOME50',
            discount: 50,
            type: 'percentage',
            minPurchase: 500,
            maxDiscount: 200,
            validFrom: '2024-11-01',
            validUntil: '2024-12-31',
            usageLimit: 100,
            usedCount: 23,
            status: 'active',
            applicableTo: 'all'
        },
        {
            id: 2,
            code: 'COURSE100',
            discount: 100,
            type: 'fixed',
            minPurchase: 1000,
            maxDiscount: null,
            validFrom: '2024-11-15',
            validUntil: '2024-12-15',
            usageLimit: 50,
            usedCount: 12,
            status: 'active',
            applicableTo: 'courses'
        },
        {
            id: 3,
            code: 'EXPIRED20',
            discount: 20,
            type: 'percentage',
            minPurchase: 0,
            maxDiscount: 100,
            validFrom: '2024-10-01',
            validUntil: '2024-10-31',
            usageLimit: 200,
            usedCount: 156,
            status: 'expired',
            applicableTo: 'all'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        discount: 0,
        type: 'percentage',
        minPurchase: 0,
        maxDiscount: null,
        validFrom: '',
        validUntil: '',
        usageLimit: 0,
        applicableTo: 'all'
    });

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...formData, id: c.id, usedCount: c.usedCount, status: c.status } : c));
        } else {
            // Generates a simple numeric ID based on timestamp, which is safe in an event handler but often flagged
            const newId = new Date().getTime();
            setCoupons([...coupons, { ...formData, id: newId, usedCount: 0, status: 'active' }]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discount: 0,
            type: 'percentage',
            minPurchase: 0,
            maxDiscount: null,
            validFrom: '',
            validUntil: '',
            usageLimit: 0,
            applicableTo: 'all'
        });
        setEditingCoupon(null);
        setShowModal(false);
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData(coupon);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this coupon?')) {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setCoupons(coupons.map(c =>
            c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
        ));
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Copied: ${code}`);
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Coupon Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Create and manage discount coupons</p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? 'repeat(4, 1fr)' : window.innerWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Total Coupons</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937' }}>{coupons.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Active</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10B981' }}>
                            {coupons.filter(c => c.status === 'active').length}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Total Uses</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3B82F6' }}>
                            {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>Expired</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#EF4444' }}>
                            {coupons.filter(c => c.status === 'expired').length}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: window.innerWidth > 768 ? '24px' : '16px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: window.innerWidth > 640 ? 'row' : 'column',
                    gap: '16px',
                    justifyContent: 'space-between',
                    alignItems: window.innerWidth > 640 ? 'center' : 'stretch'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: window.innerWidth > 640 ? '400px' : '100%' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search coupons..."
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
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#F97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Plus size={18} />
                        Create Coupon
                    </button>
                </div>

                {/* Coupons List */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Code</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Discount</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Valid Period</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Usage</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Status</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoupons.map(coupon => (
                                    <tr key={coupon.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Tag size={16} color="#F97316" />
                                                <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.95rem' }}>{coupon.code}</span>
                                                <button
                                                    onClick={() => copyCode(coupon.code)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF' }}
                                                    title="Copy code"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {coupon.type === 'percentage' ? (
                                                    <>
                                                        <Percent size={14} color="#10B981" />
                                                        <span style={{ fontWeight: 600, color: '#10B981' }}>{coupon.discount}%</span>
                                                    </>
                                                ) : (
                                                    <span style={{ fontWeight: 600, color: '#10B981' }}>₹{coupon.discount}</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                Min: ₹{coupon.minPurchase}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                                {new Date(coupon.validFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                to {new Date(coupon.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                                {coupon.usedCount} / {coupon.usageLimit}
                                            </div>
                                            <div style={{
                                                width: '100px',
                                                height: '4px',
                                                backgroundColor: '#E5E7EB',
                                                borderRadius: '2px',
                                                overflow: 'hidden',
                                                marginTop: '4px'
                                            }}>
                                                <div style={{
                                                    width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                                                    height: '100%',
                                                    backgroundColor: '#F97316'
                                                }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <button
                                                onClick={() => toggleStatus(coupon.id)}
                                                disabled={coupon.status === 'expired'}
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    border: 'none',
                                                    cursor: coupon.status === 'expired' ? 'not-allowed' : 'pointer',
                                                    backgroundColor: coupon.status === 'active' ? '#D1FAE5' : coupon.status === 'inactive' ? '#FEE2E2' : '#F3F4F6',
                                                    color: coupon.status === 'active' ? '#065F46' : coupon.status === 'inactive' ? '#991B1B' : '#6B7280',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                {coupon.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {coupon.status}
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    style={{
                                                        padding: '8px',
                                                        backgroundColor: '#3B82F615',
                                                        color: '#3B82F6',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    style={{
                                                        padding: '8px',
                                                        backgroundColor: '#EF444415',
                                                        color: '#EF4444',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Coupon Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., WELCOME50"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Discount Type *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Discount Value *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                        placeholder={formData.type === 'percentage' ? '50' : '100'}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Min Purchase (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({ ...formData, minPurchase: parseInt(e.target.value) })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Usage Limit *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Valid From *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                        Valid Until *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                    Applicable To
                                </label>
                                <select
                                    value={formData.applicableTo}
                                    onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">All Products & Courses</option>
                                    <option value="courses">Courses Only</option>
                                    <option value="products">Products Only</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
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
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCouponManagement;
