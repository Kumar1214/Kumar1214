import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, Minus, Search, TrendingUp, TrendingDown, Users, Calendar, X, Coins, Settings, Filter } from 'lucide-react';
import { walletService } from '../../../services/api';

const Wallet = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Reusing existing /api/users endpoint. 
            // Ideally we should have a dedicated endpoint for wallet management that includes balances if /api/users doesn't return them by default (it does return all fields except password).
            const response = await walletService.getAllWallets ? walletService.getAllWallets() : (await import('../../../services/api')).default.get('/users');
            // Check if response.data is array or wrapped
            const userList = Array.isArray(response.data) ? response.data : (response.data.users || []);

            setUsers(userList.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                balance: u.walletBalance || 0,
                coinBalance: u.coinBalance || 0,
                earnings: 0, // Not yet in backend
                totalCredit: 0, // Not yet in backend agg
                totalDebit: 0,
                lastTransaction: u.createdAt, // Placeholder
                status: u.status
            })));
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [modalMode, setModalMode] = useState(null); // 'credit', 'debit', 'coin-credit', 'coin-debit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    // Coin Settings
    const [showCoinSettings, setShowCoinSettings] = useState(false);
    const [coinRate, setCoinRate] = useState(1.0); // 1 Coin = ₹1

    const filteredUsers = users.filter(u =>
        (roleFilter === 'All' || u.role === roleFilter) &&
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    const totalEarnings = users.reduce((sum, u) => sum + u.earnings, 0);
    const totalCoins = users.reduce((sum, u) => sum + u.coinBalance, 0);

    const handleTransaction = async () => {
        if (selectedUser && amount > 0 && reason) {
            try {
                const type = modalMode.includes('credit') ? 'credit' : 'debit';
                const currency = modalMode.includes('coin') ? 'GG' : 'INR';

                await walletService.adminTransaction({
                    userId: selectedUser.id,
                    type,
                    amount,
                    currency,
                    description: reason
                });

                alert('Transaction Successful');
                fetchUsers(); // Refresh data
                resetModal();
            } catch (error) {
                alert(error.response?.data?.error || 'Transaction Failed');
            }
        }
    };

    const resetModal = () => {
        setModalMode(null);
        setSelectedUser(null);
        setAmount('');
        setReason('');
    };

    const openModal = (user, mode) => {
        setSelectedUser(user);
        setModalMode(mode);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {loading && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            )}
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <WalletIcon className="h-8 w-8 text-orange-400" />
                            Wallet & Coin Management
                        </h1>
                        <p className="text-blue-100 opacity-90">
                            Manage Multi-role Wallets, GG Coins, and Payouts.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCoinSettings(!showCoinSettings)}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors"
                    >
                        <Settings size={18} /> Coin Settings
                    </button>
                </div>
            </div>

            {/* Coin Settings Panel */}
            {showCoinSettings && (
                <div className="max-w-7xl mx-auto px-4 mt-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Coins className="text-orange-500" /> GG Coin Configuration</h3>
                            <p className="text-sm text-gray-500">Set the redemption value for GauGyan Coins.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-700">1 GG Coin = </span>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={coinRate}
                                    onChange={(e) => setCoinRate(e.target.value)}
                                    className="pl-6 w-24 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    step="0.1"
                                />
                            </div>
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700">Save Rate</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <WalletIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total User Balance</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalBalance.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Earnings (Vendors/Artists)</p>
                            <p className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Coins className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total GG Coins Circulating</p>
                            <p className="text-2xl font-bold text-orange-600">{totalCoins.toLocaleString()} GG</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="All">All Roles</option>
                                <option value="Learner">Learners</option>
                                <option value="Vendor">Vendors</option>
                                <option value="Artist">Artists</option>
                                <option value="GaushalaOwner">Gaushala Owners</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Wallet Balance</th>
                                    <th className="px-6 py-4">Earnings</th>
                                    <th className="px-6 py-4 text-orange-600">GG Coins</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                                <div className="text-xs font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full inline-block mt-1">{user.role}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            <span className={user.balance > 1000 ? 'text-green-600' : 'text-gray-600'}>
                                                ₹{user.balance.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {user.earnings > 0 ? (
                                                <span className="text-green-600">₹{user.earnings.toLocaleString()}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-orange-600 flex items-center gap-1">
                                            <Coins size={14} /> {user.coinBalance}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openModal(user, 'credit')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <Plus size={14} /> ₹
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(user, 'debit')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <Minus size={14} /> ₹
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openModal(user, 'coin-credit')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <Plus size={14} /> GG
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(user, 'coin-debit')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <Minus size={14} /> GG
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            {modalMode && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
                        <button
                            onClick={resetModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                            {modalMode.includes('credit') ? <Plus className="text-green-600" /> : <Minus className="text-red-600" />}
                            {modalMode.includes('coin') ? 'Manage GG Coins' : 'Manage Wallet Balance'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Transaction for <span className="font-semibold text-gray-900">{selectedUser.name}</span> ({selectedUser.email})
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {modalMode.includes('coin') ? 'Coins (Count)' : 'Amount (₹)'}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                    rows="3"
                                    placeholder="Enter reason..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={resetModal} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Cancel</button>
                                <button
                                    onClick={handleTransaction}
                                    disabled={!amount || amount <= 0 || !reason}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${modalMode.includes('credit') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
