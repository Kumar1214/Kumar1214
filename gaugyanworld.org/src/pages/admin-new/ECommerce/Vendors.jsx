
import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye, Plus, Store, AlertCircle } from 'lucide-react';

import { contentService } from '../../../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../../../context/CurrencyContext';

const Vendors = () => {
    const { formatPrice } = useCurrency();
    // Mock Vendor Data
    // Vendor Data
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const response = await contentService.getVendors();
            if (response.data.success) {
                // Map API data to UI format
                const mappedVendors = response.data.data.map(v => ({
                    ...v,
                    name: v.storeName || v.user?.name || 'Unknown',
                    email: v.contactEmail || v.user?.email || 'No Email',
                    // valid status? API uses 'active', 'pending', etc.
                    products: v.productsCount || 0, // Backend doesn't send count yet, maybe add later or default 0
                    sales: v.totalSales || 0,
                    joined: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'
                }));
                setVendors(mappedVendors);
            }
        } catch (error) {
            console.error("Failed to fetch vendors", error);
            // Fallback mock data if API fails to show UI
            setVendors([
                { id: 1, name: 'Organic Farms India', email: 'contact@organicfarms.in', status: 'active', products: 45, sales: 125000, joined: '2023-09-15' },
                { id: 2, name: 'Vedic Ghee Co.', email: 'support@vedicghee.com', status: 'pending', products: 0, sales: 0, joined: '2023-11-20' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const [showAddVendorModal, setShowAddVendorModal] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        address: ''
    });

    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusChange = async (id, newStatus) => {
        try {
            await contentService.updateVendorStatus(id, newStatus);
            setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
            toast.success(`Vendor ${newStatus} successfully`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            default: return 'bg-red-100 text-red-800';
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        try {
            await contentService.createVendor(newVendor);
            toast.success("Vendor added successfully");
            fetchVendors();
            setShowAddVendorModal(false);
            setNewVendor({ name: '', email: '', phone: '', businessName: '', address: '' });
        } catch (error) {
            console.error("Add vendor error:", error);
            toast.error("Failed to add vendor");
        }
    };

    const filteredVendors = vendors.filter(v =>
        (filterStatus === 'all' || v.status === filterStatus) &&
        (v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Store className="h-8 w-8" />
                            Vendor Management
                        </h1>
                        <p className="text-blue-100 opacity-90">
                            Manage sellers, onboarding requests, and account statuses.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddVendorModal(true)}
                        className="px-5 py-2.5 bg-white text-[#EA580C] rounded-lg font-semibold shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add New Vendor
                    </button>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Vendors</p>
                            <p className="text-2xl font-bold text-gray-800">{vendors.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Store size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                            <p className="text-2xl font-bold text-amber-600">{vendors.filter(v => v.status === 'pending').length}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Sellers</p>
                            <p className="text-2xl font-bold text-green-600">{vendors.filter(v => v.status === 'active').length}</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Check size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Filters & Search */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Vendor Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Products</th>
                                    <th className="px-6 py-4 text-right">Total Sales</th>
                                    <th className="px-6 py-4 text-center">Joined</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVendors.length > 0 ? (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{vendor.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(vendor.status)}`}>
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">{vendor.products}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPrice(vendor.sales)}</td>
                                            <td className="px-6 py-4 text-center text-gray-500 text-sm">{vendor.joined}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {vendor.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(vendor.id, 'active')}
                                                                title="Approve"
                                                                className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(vendor.id, 'suspended')} // Using suspended as rejected
                                                                title="Reject"
                                                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {vendor.status === 'active' && (
                                                        <button
                                                            onClick={() => handleStatusChange(vendor.id, 'suspended')}
                                                            title="Suspend"
                                                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                    {vendor.status === 'suspended' && (
                                                        <button
                                                            onClick={() => handleStatusChange(vendor.id, 'active')}
                                                            title="Reactivate"
                                                            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button title="View Details" className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No vendors found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Vendor Modal */}
            {showAddVendorModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
                            <button onClick={() => setShowAddVendorModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddVendor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newVendor.businessName}
                                    onChange={e => setNewVendor({ ...newVendor, businessName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newVendor.email}
                                    onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={newVendor.phone}
                                    onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={newVendor.address}
                                    onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddVendorModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium shadow-md"
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

export default Vendors;
