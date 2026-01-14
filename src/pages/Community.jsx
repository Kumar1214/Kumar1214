import React from 'react';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import UserDashboardLayout from '../layout/UserDashboardLayout';

const Community = () => {
    return (
        <UserDashboardLayout title="Community" subtitle="Connect with other learners and experts.">
            <CommunityFeed />
        </UserDashboardLayout>
    );
};

export default Community;
