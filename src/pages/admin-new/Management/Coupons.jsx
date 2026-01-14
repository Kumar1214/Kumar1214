import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit, Trash2, CheckCircle, XCircle, Copy, Percent, Calendar } from 'lucide-react';
import api from '../../../services/api'; // Import API
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch Coupons
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/coupons');
            if (data.success) {
                setCoupons(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
            // toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCoupon) {
                const { data } = await api.put(`/coupons/${editingCoupon.id}`, formData);
                if (data.success) {
                    toast.success("Coupon updated successfully");
                    fetchCoupons();
                }
            } else {
                const { data } = await api.post('/coupons', formData);
                if (data.success) {
                    toast.success("Coupon created successfully");
                    fetchCoupons();
                }
            }
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
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
        // Fix: Format dates for input type="date"
        setFormData({
            ...coupon,
            validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
            validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/coupons/${id}`);
                    toast.success("Coupon deleted");
                    setCoupons(coupons.filter(c => c.id !== id));
                    Swal.fire("Deleted!", "Coupon has been deleted.", "success");
                } catch (error) {
                    toast.error("Failed to delete coupon");
                }
            }
        });
    };

    const toggleStatus = async (coupon) => {
        try {
            const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
            await api.put(`/coupons/${coupon.id}`, { status: newStatus });
            setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, status: newStatus } : c));
            toast.success(`Coupon ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Tag className="h-8 w-8 text-orange-300" />
                        Coupon Management
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Create, manage, and track discount codes and promotions.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Coupons</p>
                        <p className="text-3xl font-bold text-gray-900">{coupons.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Active</p>
                        <p className="text-3xl font-bold text-green-600">{coupons.filter(c => c.status === 'active').length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Redemptions</p>
                        <p className="text-3xl font-bold text-blue-600">{coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Expired</p>
                        <p className="text-3xl font-bold text-red-500">{coupons.filter(c => c.status === 'expired').length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search coupon codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                            />
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-[#EA580C] hover:bg-[#c2410c] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            Create Coupon
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4">Valid Period</th>
                                    <th className="px-6 py-4">Usage</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCoupons.map(coupon => (
                                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 group">
                                                <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded font-mono font-bold border border-orange-100">
                                                    {coupon.code}
                                                </div>
                                                <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 flex items-center gap-1">
                                                {coupon.type === 'percentage' ? (
                                                    <><Percent size={14} className="text-green-500" /> {coupon.discount}%</>
                                                ) : (
                                                    <span className="text-green-600">₹{coupon.discount}</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">Min spend: ₹{coupon.minPurchase}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs"><Calendar size={12} /> {new Date(coupon.validFrom).toLocaleDateString()}</span>
                                                <span className="text-xs text-gray-400">to</span>
                                                <span className="flex items-center gap-1 text-xs"><Calendar size={12} /> {new Date(coupon.validUntil).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 w-24">
                                                <div className="flex justify-between text-xs font-medium text-gray-600">
                                                    <span>{coupon.usedCount}</span>
                                                    <span className="text-gray-400">/ {coupon.usageLimit}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-500 rounded-full"
                                                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(coupon)}
                                                disabled={coupon.status === 'expired'}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border cursor-pointer ${coupon.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    coupon.status === 'expired' ? 'bg-gray-50 text-gray-500 border-gray-100 cursor-not-allowed' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}
                                            >
                                                {coupon.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {coupon.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., WELCOME50"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({ ...formData, minPurchase: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To</label>
                                <select
                                    value={formData.applicableTo}
                                    onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="all">All Products & Courses</option>
                                    <option value="courses">Courses Only</option>
                                    <option value="products">Products Only</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-lg font-medium transition-colors shadow-sm"
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

export default Coupons;
