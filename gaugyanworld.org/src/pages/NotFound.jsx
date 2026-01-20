import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertOctagon } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            padding: 'var(--spacing-xl)'
        }}>
            <AlertOctagon size={80} color="var(--color-primary)" style={{ marginBottom: 'var(--spacing-lg)' }} />
            <h1 style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1
            }}>
                404
            </h1>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: 'var(--spacing-lg)'
            }}>
                Page Not Found
            </h2>
            <p style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--spacing-2xl)',
                maxWidth: '500px'
            }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <Link to="/">
                    <Button>
                        <Home size={18} style={{ marginRight: '8px' }} />
                        Go Home
                    </Button>
                </Link>
                <Link to="/courses">
                    <Button variant="secondary">
                        <Search size={18} style={{ marginRight: '8px' }} />
                        Explore Courses
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
