
import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Search, CheckCircle, XCircle, Calendar, User, Clock, AlertTriangle, Filter, MoreVertical, Eye, Trash2, FileText } from 'lucide-react';
import PayoutDetailModal from './PayoutDetailModal';
import { contentService } from '../../../services/api';
import toast from 'react-hot-toast';

const Payouts = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Mock payout data
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPayouts();
    }, [filterStatus, searchQuery]); // Re-fetch on filter change or debounce search? 
    // Actually simplicity: fetch all then filter client side, or fetch with params.
    // Given the UI filters, let's fetch initially.

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const response = await contentService.getPayouts(); // Add params if needed
            if (response.data.success) {
                setPayouts(response.data.data);
            }
        } catch (error) {
            console.error("Fetch payouts error:", error);
            // Mock data fallback
            setPayouts([
                { id: 1, vendorId: 2, vendorName: 'Organic Farms India', amount: 15000, status: 'pending', requestDate: '2024-11-28', type: 'vendor', period: 'November 2024' },
                { id: 2, vendorId: 3, vendorName: 'Dr. Rajesh Sharma', amount: 8500, status: 'completed', requestDate: '2024-11-25', completedDate: '2024-11-27', type: 'instructor', period: 'November 2024' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.action-dropdown')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);


    const filteredPayouts = payouts.filter(payout =>
        (filterStatus === 'all' || payout.status === filterStatus) &&
        (payout.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payout.period?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm("Confirm approval of this payout?")) {
            try {
                await contentService.updatePayoutStatus(id, 'completed');
                setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'completed' } : p));
                toast.success(`Payout #${id} Approved`);
            } catch (error) {
                toast.error("Failed to approve payout");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payout request?")) {
            try {
                await contentService.deletePayout(id);
                setPayouts(payouts.filter(p => p.id !== id));
                toast.success("Payout deleted");
            } catch (error) {
                toast.error("Failed to delete payout");
            }
        }
    };

    const totalPending = filteredPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const totalCompleted = filteredPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const totalProcessing = filteredPayouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <DollarSign className="h-8 w-8" />
                        Payout Management
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Process and track payments to vendors, instructors, and artists.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Payouts</p>
                        <p className="text-2xl font-bold text-gray-800">{payouts.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Pending Amount</p>
                        <p className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Processing</p>
                        <p className="text-2xl font-bold text-blue-600">₹{totalProcessing.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-600">₹{totalCompleted.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible">

                    {/* Filters */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or period..."
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
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-visible min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Recipient</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Period</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPayouts.length > 0 ? (
                                    filteredPayouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">#{payout.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="font-medium text-gray-800">{payout.vendorName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold uppercase tracking-wide">
                                                    {payout.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{payout.period}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">₹{payout.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(payout.status)}`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {payout.requestDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                {/* 3-Dot Menu Trigger */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === payout.id ? null : payout.id); }}
                                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors action-dropdown"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeDropdown === payout.id && (
                                                    <div
                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 action-dropdown animate-fade-in origin-top-right"
                                                        style={{ top: '100%', right: '24px' }}
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => { setSelectedPayout(payout); setActiveDropdown(null); }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Eye size={16} className="text-blue-500" /> View Details
                                                            </button>

                                                            {payout.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => { handleApprove(payout.id); setActiveDropdown(null); }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                    >
                                                                        <CheckCircle size={16} className="text-green-500" /> Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { handleDelete(payout.id); setActiveDropdown(null); }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                    >
                                                                        <Trash2 size={16} /> Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertTriangle size={36} className="text-gray-300" />
                                                <p>No payouts found matching your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <PayoutDetailModal
                payout={selectedPayout}
                onClose={() => setSelectedPayout(null)}
                onApprove={handleApprove}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Payouts;
