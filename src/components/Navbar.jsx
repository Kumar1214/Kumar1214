import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, Heart, User, ChevronDown, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import InstallApp from './InstallApp';
import Button from './Button'; // Assuming Button component exists or use standard button

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [settings, setSettings] = useState({
        logo: '/gaugyan-logo.png',
        topBar: {
            enabled: true,
            links: [
                { label: '📍 Gaushala Near Me', url: '/gaushala' },
                { label: '📢 Advertise with Gaugyan', url: '/advertise' }
            ]
        }
    });

    const { user, logout } = useAuth();
    const { getCartTotals } = useCart();
    const { getWishlistCount } = useWishlist();
    const navigate = useNavigate();

    const cartCount = getCartTotals().itemCount;
    const wishlistCount = getWishlistCount();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Dynamic import to avoid circular dependencies if any, though api.js is safe
                const { settingsService } = await import('../services/api');
                const response = await settingsService.getSettings('header');
                if (response.data && response.data.settings) {
                    setSettings(prev => ({ ...prev, ...response.data.settings }));
                }
            } catch (error) {
                console.error('Error fetching header settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleDropdownEnter = (name) => setActiveDropdown(name);
    const handleDropdownLeave = () => setActiveDropdown(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            // Implement search navigation if search page exists
            // navigate(`/search?q=${e.target.value}`);
        }
    }

    return (
        <>
            {/* Pre-Header */}
            {settings.topBar?.enabled && (
                <div style={{ backgroundColor: '#1F5B6B', color: 'white', padding: '8px 0', fontSize: '0.875rem' }}>
                    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {settings.topBar.links && settings.topBar.links.length > 0 ? (
                            settings.topBar.links.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.url}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))
                        ) : (
                            <>
                                <Link
                                    to="/gaushala"
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    📍 Gaushala Near Me
                                </Link>
                                <Link
                                    to="/advertise"
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    📢 Advertise with Gaugyan
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Main Navbar */}
            <nav style={{ backgroundColor: 'var(--color-bg-white)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>

                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={settings.logo || "/gaugyan-logo.png"} alt="Gaugyan Logo" style={{ height: '65px', width: 'auto', objectFit: 'contain' }} />
                    </Link>

                    {/* Desktop Navigation - Hidden on Mobile/Tablet */}
                    <div className="nav-hidden-mobile" style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center', height: '100%' }}>

                        {/* Education Dropdown */}
                        <div
                            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => handleDropdownEnter('education')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                Education <ChevronDown size={16} />
                            </span>
                            {activeDropdown === 'education' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-md)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-sm)',
                                    minWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <Link to="/courses" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Courses</Link>
                                    <Link to="/exams" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Exams</Link>
                                    <Link to="/quizzes" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Quizzes</Link>
                                    <Link to="/knowledgebase" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Knowledgebase</Link>
                                </div>
                            )}
                        </div>

                        {/* Entertainment Dropdown */}
                        <div
                            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => handleDropdownEnter('entertainment')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                Entertainment <ChevronDown size={16} />
                            </span>
                            {activeDropdown === 'entertainment' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-md)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-sm)',
                                    minWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <Link to="/music" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Music</Link>
                                    <Link to="/podcast" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Podcasts</Link>
                                    <Link to="/meditation" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Meditation</Link>
                                </div>
                            )}
                        </div>

                        {/* Astrology Dropdown */}
                        <div
                            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => handleDropdownEnter('astrology')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-main)' }}>
                                Astrology <ChevronDown size={16} />
                            </span>
                            {activeDropdown === 'astrology' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-md)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-sm)',
                                    minWidth: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <Link to="/panchang" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Daily Panchang</Link>
                                    <Link to="/astrology" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Consult Astrologer</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/shop" style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>Shop</Link>
                        <Link to="/about" style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>About Us</Link>
                        <Link to="/contact" style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>Contact Us</Link>
                    </div>

                    {/* Search Bar - Desktop/Tablet Landscape */}
                    <div className="nav-hidden-mobile" style={{ flex: 1, maxWidth: '300px', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            onKeyDown={handleSearch}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem 0.5rem 2.5rem',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid #E5E7EB',
                                backgroundColor: 'var(--color-bg-input)'
                            }}
                        />
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    </div>

                    {/* Actions - Visible on large screens */}
                    <div className="nav-hidden-mobile" style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                        <Link to="/wishlist" style={{ position: 'relative', cursor: 'pointer', textDecoration: 'none' }}>
                            <Heart
                                size={24}
                                color="var(--color-text-main)"
                                fill={wishlistCount > 0 ? "var(--color-primary)" : "none"}
                                style={{ transition: 'all 0.2s' }}
                            />
                            {wishlistCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    fontSize: '10px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>{wishlistCount}</span>
                            )}
                        </Link>
                        <Link to="/cart" style={{ position: 'relative', cursor: 'pointer', textDecoration: 'none' }}>
                            <ShoppingCart size={24} color="var(--color-text-main)" />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    fontSize: '10px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>{cartCount}</span>
                            )}
                        </Link>
                        {user && (
                            <Link to="/wallet" style={{ position: 'relative' }} title="My Wallet">
                                <Wallet size={24} color="var(--color-text-main)" />
                            </Link>
                        )}

                        <InstallApp />

                        <div
                            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => handleDropdownEnter('profile')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <User size={20} color="var(--color-text-main)" />
                            </div>
                            {activeDropdown === 'profile' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-md)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--spacing-sm)',
                                    minWidth: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    {user ? (
                                        <>
                                            <div style={{ padding: '8px 12px', fontSize: '14px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB', marginBottom: '4px' }}>
                                                {user.displayName || 'User'}
                                            </div>
                                            <Link to={
                                                user?.role === 'admin' ? '/admin' :
                                                    user?.role === 'vendor' ? '/vendor/dashboard' :
                                                        user?.role === 'instructor' ? '/instructor/dashboard' :
                                                            user?.role === 'artist' ? '/artist/dashboard' :
                                                                user?.role === 'author' ? '/author/dashboard' :
                                                                    user?.role === 'gaushala_owner' ? '/gaushala/dashboard' :
                                                                        '/dashboard'
                                            } style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>
                                                {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                                            </Link>
                                            <Link to="/profile" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Settings</Link>
                                            <div
                                                onClick={() => {
                                                    logout();
                                                    window.location.href = '/login';
                                                }}
                                                style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: '#EF4444', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                                            >
                                                Logout
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Login</Link>
                                            <Link to="/signup" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', textDecoration: 'none', display: 'block' }}>Sign Up</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile/Tablet Menu Button - Visible below 1024px */}
                    <div className="nav-hidden-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Mobile Actions (Cart/Profile shortcts can be here or inside menu) */}
                        <Link to="/cart" className="nav-hidden-desktop" style={{ position: 'relative', cursor: 'pointer', textDecoration: 'none' }}>
                            <ShoppingCart size={24} color="var(--color-text-main)" />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: -5, right: -5, backgroundColor: 'var(--color-primary)', color: 'white',
                                    fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>{cartCount}</span>
                            )}
                        </Link>

                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile/Tablet Menu Dropdown */}
                {isOpen && (
                    <div style={{
                        backgroundColor: 'var(--color-bg-white)',
                        borderTop: '1px solid var(--color-text-light)',
                        padding: 'var(--spacing-md)',
                        position: 'absolute',
                        width: '100%',
                        left: 0,
                        boxShadow: 'var(--shadow-md)',
                        maxHeight: 'calc(100vh - 80px)', // Prevent overflow
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {/* Mobile Search */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onKeyDown={handleSearch}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: 'var(--color-bg-input)'
                                    }}
                                />
                                <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            </div>

                            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Education</div>
                            <Link to="/courses" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Courses</Link>
                            <Link to="/exams" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Exams</Link>
                            <Link to="/quizzes" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Quizzes</Link>

                            <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '8px' }}>Entertainment</div>
                            <Link to="/music" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Music</Link>
                            <Link to="/podcast" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Podcasts</Link>
                            <Link to="/meditation" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Meditation</Link>

                            <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginTop: '8px' }}>Astrology</div>
                            <Link to="/panchang" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Daily Panchang</Link>
                            <Link to="/astrology" onClick={toggleMenu} style={{ paddingLeft: '16px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Consult Astrologer</Link>

                            <Link to="/shop" onClick={toggleMenu} style={{ marginTop: '8px', color: 'var(--color-text-main)', textDecoration: 'none' }}>Shop</Link>
                            <Link to="/about" onClick={toggleMenu} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>About Us</Link>
                            <Link to="/contact" onClick={toggleMenu} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Contact Us</Link>

                            {/* Mobile Profile & Wallet Links */}
                            <hr style={{ border: '0', borderTop: '1px solid #E5E7EB' }} />
                            {user && (
                                <Link to="/wallet" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', textDecoration: 'none' }}>
                                    <Wallet size={20} /> My Wallet
                                </Link>
                            )}

                            {user ? (
                                <Link to={
                                    user?.role === 'admin' ? '/admin' :
                                        user?.role === 'vendor' ? '/vendor/dashboard' :
                                            user?.role === 'instructor' ? '/instructor/dashboard' :
                                                user?.role === 'artist' ? '/artist/dashboard' :
                                                    user?.role === 'author' ? '/author/dashboard' :
                                                        user?.role === 'gaushala_owner' ? '/gaushala/dashboard' :
                                                            '/dashboard'
                                } onClick={toggleMenu} style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={20} /> {user.displayName || 'My Dashboard'}
                                </Link>
                            ) : (
                                <Link to="/login" onClick={toggleMenu} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Login / Register</Link>
                            )}
                            {user && (
                                <div onClick={() => { logout(); window.location.href = '/login'; }} style={{ color: '#EF4444', cursor: 'pointer', paddingLeft: '28px' }}>
                                    Logout
                                </div>
                            )}

                            <div className="mt-2 mb-2">
                                <InstallApp />
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
