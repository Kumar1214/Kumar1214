import React, { useState } from 'react';
import { Wallet, Plus, Minus, Search, Filter, Eye, DollarSign, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';

const AdminWalletManagement = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            balance: 2450,
            totalCredit: 3650,
            totalDebit: 1200,
            lastTransaction: '2024-11-30',
            status: 'active'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@example.com',
            balance: 1200,
            totalCredit: 2000,
            totalDebit: 800,
            lastTransaction: '2024-11-29',
            status: 'active'
        },
        {
            id: 3,
            name: 'Amit Patel',
            email: 'amit@example.com',
            balance: 500,
            totalCredit: 1500,
            totalDebit: 1000,
            lastTransaction: '2024-11-28',
            status: 'active'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showDebitModal, setShowDebitModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    const totalCredits = users.reduce((sum, u) => sum + u.totalCredit, 0);
    const totalDebits = users.reduce((sum, u) => sum + u.totalDebit, 0);

    const handleCredit = () => {
        if (selectedUser && amount > 0) {
            setUsers(users.map(u =>
                u.id === selectedUser.id
                    ? { ...u, balance: u.balance + parseInt(amount), totalCredit: u.totalCredit + parseInt(amount) }
                    : u
            ));
            alert(`₹${amount} credited to ${selectedUser.name}'s wallet\nReason: ${reason}`);
            resetModal();
        }
    };

    const handleDebit = () => {
        if (selectedUser && amount > 0) {
            if (selectedUser.balance >= parseInt(amount)) {
                setUsers(users.map(u =>
                    u.id === selectedUser.id
                        ? { ...u, balance: u.balance - parseInt(amount), totalDebit: u.totalDebit + parseInt(amount) }
                        : u
                ));
                alert(`₹${amount} debited from ${selectedUser.name}'s wallet\nReason: ${reason}`);
                resetModal();
            } else {
                alert('Insufficient balance!');
            }
        }
    };

    const resetModal = () => {
        setShowCreditModal(false);
        setShowDebitModal(false);
        setSelectedUser(null);
        setAmount('');
        setReason('');
    };

    const openCreditModal = (user) => {
        setSelectedUser(user);
        setShowCreditModal(true);
    };

    const openDebitModal = (user) => {
        setSelectedUser(user);
        setShowDebitModal(true);
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: window.innerWidth > 768 ? '32px' : '16px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: window.innerWidth > 768 ? '2rem' : '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                        Wallet Management
                    </h1>
                    <p style={{ color: '#6B7280' }}>Manage user wallets and transactions</p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 1024 ? 'repeat(4, 1fr)' : window.innerWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#8B5CF615',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Wallet size={24} color="#8B5CF6" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Total Balance</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1F2937' }}>₹{totalBalance.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#10B98115',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrendingUp size={24} color="#10B981" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Total Credits</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>₹{totalCredits.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#EF444415',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrendingDown size={24} color="#EF4444" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Total Debits</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#EF4444' }}>₹{totalDebits.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: '#3B82F615',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Users size={24} color="#3B82F6" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Active Users</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3B82F6' }}>{users.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: window.innerWidth > 768 ? '24px' : '16px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users by name or email..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>
                </div>

                {/* Users Table */}
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
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>User</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Balance</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Total Credit</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Total Debit</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Last Transaction</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>{user.email}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: user.balance > 1000 ? '#10B981' : '#F97316'
                                            }}>
                                                ₹{user.balance.toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '0.95rem', color: '#10B981', fontWeight: 600 }}>
                                                +₹{user.totalCredit.toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '0.95rem', color: '#EF4444', fontWeight: 600 }}>
                                                -₹{user.totalDebit.toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                {new Date(user.lastTransaction).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => openCreditModal(user)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: '#10B98115',
                                                        color: '#10B981',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600
                                                    }}
                                                    title="Add Credit"
                                                >
                                                    <Plus size={14} />
                                                    Credit
                                                </button>
                                                <button
                                                    onClick={() => openDebitModal(user)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: '#EF444415',
                                                        color: '#EF4444',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600
                                                    }}
                                                    title="Deduct Amount"
                                                >
                                                    <Minus size={14} />
                                                    Debit
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

            {/* Credit Modal */}
            {showCreditModal && selectedUser && (
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
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Add Credit</h3>
                        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                            Add money to {selectedUser.name}'s wallet
                        </p>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                Amount (₹) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                Reason *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason for credit"
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={resetModal}
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
                                onClick={handleCredit}
                                disabled={!amount || amount <= 0 || !reason}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: amount > 0 && reason ? '#10B981' : '#E5E7EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: amount > 0 && reason ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Add Credit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Debit Modal */}
            {showDebitModal && selectedUser && (
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
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Deduct Amount</h3>
                        <p style={{ color: '#6B7280', marginBottom: '8px' }}>
                            Deduct money from {selectedUser.name}'s wallet
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#EF4444', marginBottom: '24px' }}>
                            Current Balance: ₹{selectedUser.balance.toLocaleString()}
                        </p>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                Amount (₹) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={selectedUser.balance}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#EF4444'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                                Reason *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason for debit"
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={resetModal}
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
                                onClick={handleDebit}
                                disabled={!amount || amount <= 0 || !reason}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    backgroundColor: amount > 0 && reason ? '#EF4444' : '#E5E7EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: amount > 0 && reason ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Deduct Amount
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWalletManagement;
