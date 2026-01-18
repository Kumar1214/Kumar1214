import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Search, CheckCircle, XCircle, AlertCircle, ShoppingBag, Eye, Filter, MoreVertical, Plus, Trash2, X } from 'lucide-react';
import { contentService } from '../../../services/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../../../context/CurrencyContext';

const Refunds = () => {
    const { formatPrice } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Refunds Data
    const [refunds, setRefunds] = useState([]);

    useEffect(() => {
        fetchRefunds();
    }, []);

    const fetchRefunds = async () => {
        try {
            const response = await contentService.getRefunds();
            if (response.data.success) {
                setRefunds(response.data.data);
            }
        } catch (error) {
            console.error("Fetch refunds error:", error);
            // Fallback
            setRefunds([
                { id: 'REF-1001', orderId: 'ORD-7829', customer: 'Rahul Verma', amount: 1250, reason: 'Product damaged in transit', status: 'pending', date: '2024-12-01', items: 'Organic Ghee (500ml)' },
            ]);
        }
    };

    // Refund Reasons Management
    const [refundReasons, setRefundReasons] = useState([
        'Product damaged in transit',
        'Wrong item received',
        'Quality not as expected',
        'Changed mind',
        'Item missing from package',
        'Expired product'
    ]);
    const [showReasonsModal, setShowReasonsModal] = useState(false);
    const [newReason, setNewReason] = useState('');

    // View Modal
    const [selectedRefund, setSelectedRefund] = useState(null);

    // Actions Menu
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddReason = () => {
        if (newReason.trim()) {
            setRefundReasons([...refundReasons, newReason.trim()]);
            setNewReason('');
        }
    };

    const handleDeleteReason = (index) => {
        const newReasons = refundReasons.filter((_, i) => i !== index);
        setRefundReasons(newReasons);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await contentService.updateRefundStatus(id, newStatus);
            setRefunds(refunds.map(r => r.id === id ? { ...r, status: newStatus } : r));
            toast.success(`Refund status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update refund status:', error);
            toast.error("Failed to update status");
        }
        setActiveMenuId(null);
    };

    const filteredRefunds = refunds.filter(refund =>
        (filterStatus === 'all' || refund.status === filterStatus) &&
        (refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <RefreshCw className="h-8 w-8" />
                            Refund Orders
                        </h1>
                        <p className="text-blue-100 opacity-90">
                            Manage refund requests, approve returns, and handle disputes.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowReasonsModal(true)}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/20"
                    >
                        <AlertCircle size={18} />
                        Manage Reasons
                    </button>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                            <p className="text-2xl font-bold text-amber-600">{refunds.filter(r => r.status === 'pending').length}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <ClockIcon />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Refunded</p>
                            <p className="text-2xl font-bold text-green-600">{formatPrice(refunds.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0))}</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{refunds.filter(r => r.status === 'rejected').length}</p>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <XCircle size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible"> {/* overflow-visible for dropdowns */}

                    {/* Filters */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search ID, Order, or Customer..."
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
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-visible min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Refund ID</th>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRefunds.length > 0 ? (
                                    filteredRefunds.map((refund) => (
                                        <tr key={refund.id} className="hover:bg-gray-50 transition-colors group relative">
                                            <td className="px-6 py-4 font-medium text-gray-900">{refund.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800 text-sm">{refund.orderId}</span>
                                                    <span className="text-xs text-gray-500">{refund.items}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">{refund.customer}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={refund.reason}>{refund.reason}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">{formatPrice(refund.amount)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(refund.status)}`}>
                                                    {refund.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === refund.id ? null : refund.id);
                                                    }}
                                                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${activeMenuId === refund.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {/* Action Menu */}
                                                {activeMenuId === refund.id && (
                                                    <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                                        <button
                                                            onClick={() => { setSelectedRefund(refund); setActiveMenuId(null); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Eye size={16} /> View Details
                                                        </button>
                                                        {refund.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(refund.id, 'approved')}
                                                                    className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                                >
                                                                    <CheckCircle size={16} /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(refund.id, 'rejected')}
                                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <XCircle size={16} /> Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No refund requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Manage Reasons Modal */}
            {showReasonsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Manage Refund Reasons</h3>
                            <button onClick={() => setShowReasonsModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                    placeholder="Add new reason..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddReason()}
                                />
                                <button
                                    onClick={handleAddReason}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                    disabled={!newReason.trim()}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {refundReasons.map((reason, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                                        <span className="text-gray-700 text-sm">{reason}</span>
                                        <button
                                            onClick={() => handleDeleteReason(index)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {refundReasons.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-4">No reasons added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                        <button
                            onClick={() => setShowReasonsModal(false)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
            {/* View Details Modal */}
            {selectedRefund && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#0c2d50] to-[#EA580C] text-white">
                            <h3 className="text-lg font-bold">Refund Details</h3>
                            <button onClick={() => setSelectedRefund(null)} className="text-white/80 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-xs uppercase text-gray-500 font-bold mb-1">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(selectedRefund.status)}`}>
                                        {selectedRefund.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase text-gray-500 font-bold mb-1">Refund Amount</p>
                                    <p className="text-3xl font-bold text-[#0c2d50]">{formatPrice(selectedRefund.amount)}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Refund ID</p>
                                        <p className="font-semibold text-gray-900">{selectedRefund.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                        <p className="font-semibold text-gray-900">{selectedRefund.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Customer</p>
                                        <p className="font-semibold text-gray-900">{selectedRefund.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Request Date</p>
                                        <p className="font-semibold text-gray-900">{new Date(selectedRefund.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Item(s) for Return</p>
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                            <ShoppingBag className="text-gray-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedRefund.items}</p>
                                            <p className="text-sm text-gray-500">Qty: 1</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-900 mb-2">Customer Reason</p>
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-900 text-sm">
                                        "{selectedRefund.reason}"
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedRefund(null)}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                {selectedRefund.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => { handleStatusChange(selectedRefund.id, 'rejected'); setSelectedRefund(null); }}
                                            className="px-5 py-2.5 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
                                        >
                                            Reject Refund
                                        </button>
                                        <button
                                            onClick={() => { handleStatusChange(selectedRefund.id, 'approved'); setSelectedRefund(null); }}
                                            className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                                        >
                                            Approve Refund
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default Refunds;
