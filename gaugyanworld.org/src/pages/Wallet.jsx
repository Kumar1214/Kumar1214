import React from 'react';
import UserDashboardLayout from '../layout/UserDashboardLayout';
import WalletSection from '../components/dashboard/WalletSection';

const Wallet = () => {
    return (
        <UserDashboardLayout title="My Wallet" subtitle="Manage your balance, coins, and transactions.">
            <WalletSection />
        </UserDashboardLayout>
    );
};

export default Wallet;

