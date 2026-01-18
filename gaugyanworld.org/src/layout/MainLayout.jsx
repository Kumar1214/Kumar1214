import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const MainLayout = () => {
    const location = useLocation();

    // Define routes where Navbar and Footer should be hidden (Dashboard routes)
    const dashboardRoutes = [
        '/dashboard',
        '/my-courses',
        '/my-orders',
        '/my-results',
        '/wallet',
        '/certificates',
        '/wishlist',
        '/profile'
    ];

    const isDashboard = dashboardRoutes.some(route => location.pathname.startsWith(route));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {!isDashboard && <Navbar />}
            <main style={{ flex: 1, marginBottom: isDashboard ? '0' : '40px' }}>
                <Outlet />
            </main>
            {!isDashboard && <Footer />}
            <Chatbot />
        </div>
    );
};

export default MainLayout;
