import React, { useState, useEffect } from 'react';
import { walletService } from '../../services/api';
import {
    Wallet as WalletIcon, TrendingUp, TrendingDown,
    Plus, ArrowUpRight, ArrowDownLeft, Calendar,
    RefreshCw, CheckCircle, Coins, ArrowRightLeft
} from 'lucide-react';

const WalletSection = () => {
    const [activeTab, setActiveTab] = useState('all'); // all, credit, debit
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [showRedeem, setShowRedeem] = useState(false);
    const [amount, setAmount] = useState('');
    const [redeemCoins, setRedeemCoins] = useState('');

    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [coinBalance, setCoinBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const coinRate = 1.0;

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const response = await walletService.getMyWallet();
            if (response.data.success) {
                setWalletBalance(response.data.data.walletBalance);
                setCoinBalance(response.data.data.coinBalance);

                // Map backend transactions to frontend format
                const mappedTxns = response.data.data.transactions.map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: t.amount,
                    description: t.description,
                    date: t.date,
                    status: t.status,
                    isCoin: t.currency === 'GG',
                    icon: t.currency === 'GG' ? Coins : (t.type === 'credit' ? TrendingUp : TrendingDown),
                    color: t.currency === 'GG' ? '#F59E0B' : (t.type === 'credit' ? '#10B981' : '#EF4444')
                }));
                setTransactions(mappedTxns);
            }
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t =>
        activeTab === 'all' || t.type === activeTab
    );

    const totalCredit = transactions.filter(t => t.type === 'credit' && !t.isCoin).reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = transactions.filter(t => t.type === 'debit' && !t.isCoin).reduce((sum, t) => sum + t.amount, 0);

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) return;
        try {
            await walletService.addMoney(amount);
            setShowAddMoney(false);
            setAmount('');
            alert(`Successfully added money!`);
            fetchWalletData();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add money");
        }
    };

    const handleRedeemCoins = async () => {
        if (!redeemCoins || redeemCoins > coinBalance) return;
        try {
            await walletService.redeemCoins(redeemCoins);
            setShowRedeem(false);
            setRedeemCoins('');
            alert(`Successfully redeemed coins!`);
            fetchWalletData();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to redeem coins");
        }
    };

    if (loading && walletBalance === 0 && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <WalletIcon className="text-orange-600" /> My Wallet
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
                {/* Balance Card - Primary Theme */}
                <div style={{
                    background: 'linear-gradient(135deg, #1F5B6B 0%, #164551 100%)',
                    borderRadius: '20px',
                    padding: '32px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>Available Balance</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            ₹{Number(walletBalance).toLocaleString()}
                        </div>
                        <button
                            onClick={() => setShowAddMoney(true)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: 'white',
                                color: '#1F5B6B',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Plus size={18} /> Add Money
                        </button>
                    </div>
                    {/* Decorative Circles */}
                    <div style={{ position: 'absolute', top: -20, right: -20, width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', bottom: -40, left: -20, width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                </div>

                {/* Coin Card */}
                <div style={{
                    backgroundColor: '#F0F9FB', // Light teal tint
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid rgba(31, 91, 107, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#1F5B6B' }}>
                        <Coins size={20} /> <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>GG Coins</span>
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        marginBottom: '16px',
                        color: '#1F5B6B'
                    }}>
                        {coinBalance} <span style={{ fontSize: '1rem', fontWeight: 500 }}>GG</span>
                    </div>
                    <button
                        onClick={() => setShowRedeem(true)}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#EA580C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%'
                        }}
                    >
                        <ArrowRightLeft size={16} /> Redeem
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowDownLeft size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2px' }}>Total Credit</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>₹{totalCredit.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={24} className="text-red-500" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '2px' }}>Total Debit</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EF4444' }}>₹{totalDebit.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                    <div className="flex gap-2">
                        {['all', 'credit', 'debit'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                                    ${activeTab === tab
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredTransactions.map(transaction => (
                        <div
                            key={transaction.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: `${transaction.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <transaction.icon size={20} color={transaction.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 mb-1 truncate">
                                    {transaction.description}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: transaction.color,
                                    marginBottom: '2px'
                                }}>
                                    {transaction.type === 'credit' ? '+' : '-'}
                                    {transaction.isCoin ? ` ${transaction.amount} GG` : `₹${transaction.amount}`}
                                </div>
                                <div className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                                    <CheckCircle size={12} />
                                    {transaction.status}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddMoney && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">Add Money</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddMoney(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMoney}
                                disabled={!amount || amount <= 0}
                                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                                Add Money
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Redeem Coins Modal */}
            {showRedeem && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-1 text-gray-900">Redeem GG Coins</h3>
                        <p className="text-sm text-gray-500 mb-6">Balance: {coinBalance} GG</p>

                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg mb-6 text-sm text-orange-700">
                            Rate: <strong>1 GG = ₹{coinRate}</strong>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coins to Redeem
                            </label>
                            <input
                                type="number"
                                value={redeemCoins}
                                max={coinBalance}
                                onChange={(e) => setRedeemCoins(e.target.value)}
                                placeholder="Enter coins"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
                            />
                            {redeemCoins && (
                                <p className="mt-2 text-sm text-emerald-600 font-medium">
                                    You get: ₹{(parseInt(redeemCoins) * coinRate).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRedeem(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRedeemCoins}
                                disabled={!redeemCoins || redeemCoins <= 0 || redeemCoins > coinBalance}
                                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                Redeem
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletSection;
