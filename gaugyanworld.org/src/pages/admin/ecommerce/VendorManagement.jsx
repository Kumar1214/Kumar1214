import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { contentService } from '../../../services/api'; // Needed
import { MoreVertical, Check, X, Eye, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVendor, setNewVendor] = useState({
        storeName: '',
        owner: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const response = await contentService.getVendors();
            if (response.data.success) {
                setVendors(response.data.data);
                // Calculate stats
                const total = response.data.count;
                const pending = response.data.data.filter(v => v.verificationStatus === 'pending').length;
                const approved = response.data.data.filter(v => v.verificationStatus === 'approved').length;
                setStats({ total, pending, approved });
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error("Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await contentService.updateVendorStatus(id, newStatus);
            toast.success(`Vendor ${newStatus} successfully`);
            fetchVendors(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        try {
            await contentService.createVendor(newVendor);
            toast.success('Vendor added successfully');
            setShowAddModal(false);
            setNewVendor({ storeName: '', owner: '', email: '', phone: '', address: '' });
            fetchVendors();
        } catch (error) {
            console.error("Error adding vendor:", error);
            toast.error("Failed to add vendor");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Vendor Management</h1>
                    <div className="text-sm text-gray-500 flex gap-4 mt-1">
                        <span>Total: {stats.total}</span>
                        <span className="text-yellow-600">Pending: {stats.pending}</span>
                        <span className="text-green-600">Approved: {stats.approved}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">Export List</Button>
                    <Button onClick={() => setShowAddModal(true)}>Add Vendor</Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Store Name</th>
                            <th className="p-4 font-semibold text-gray-600">Owner</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Date Applied</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : vendors.map(vendor => (
                            <tr key={vendor.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-semibold">{vendor.storeName}</div>
                                    <div className="text-sm text-gray-500">{vendor.email}</div>
                                </td>
                                <td className="p-4">{vendor.owner}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">{vendor.date}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {vendor.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(vendor.id, 'approved')} className="p-1 rounded hover:bg-green-100 text-green-600" title="Approve">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => handleStatusUpdate(vendor.id, 'rejected')} className="p-1 rounded hover:bg-red-100 text-red-600" title="Reject">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-1 rounded hover:bg-gray-100 text-gray-600" title="View Details">
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
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
                        <form onSubmit={handleAddVendor}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Store Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={newVendor.storeName}
                                        onChange={(e) => setNewVendor({ ...newVendor, storeName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Owner Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={newVendor.owner}
                                        onChange={(e) => setNewVendor({ ...newVendor, owner: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full border rounded px-3 py-2"
                                        value={newVendor.email}
                                        onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full border rounded px-3 py-2"
                                        value={newVendor.phone}
                                        onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2"
                                        rows="3"
                                        value={newVendor.address}
                                        onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Vendor</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
