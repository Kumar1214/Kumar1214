import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, Mail, Phone, MapPin, Youtube } from 'lucide-react';

const Footer = () => {
    const [socialLinks, setSocialLinks] = React.useState({});
    const [footerSettings, setFooterSettings] = React.useState({
        description: 'Empowering people with cow\'s multidimensional aspects.',
        contact: {
            email: 'info@gaugyan.com',
            phone: '+91 6367176883',
            address: 'Plot No-20, Bhairu Nagar, Hathoj, Kalwar Road, Jhotwara Jaipur-302012',
            gst: '08ABBFG3554F1ZK'
        }
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Dynamic import to avoid circular dependencies if any
                const { settingsService } = await import('../services/api');

                // Fetch Social Settings
                const socialResponse = await settingsService.getSettings('social');
                if (socialResponse.data && socialResponse.data.settings) {
                    setSocialLinks(socialResponse.data.settings);
                }

                // Fetch Footer Settings
                const footerResponse = await settingsService.getSettings('footer');
                if (footerResponse.data && footerResponse.data.settings) {
                    setFooterSettings(prev => ({ ...prev, ...footerResponse.data.settings }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const getSocialIcon = (platform, size = 20) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return <Facebook size={size} />;
            case 'twitter': return <Twitter size={size} />;
            case 'instagram': return <Instagram size={size} />;
            case 'linkedin': return <Linkedin size={size} />;
            case 'youtube': return <Youtube size={size} />;
            default: return null;
        }
    };

    return (
        <footer style={{
            backgroundColor: '#0c2d50', // Updated to match Navy Blue from logo
            color: 'white',
            padding: '4rem 0 2rem',
            marginTop: 'auto'
        }}>
            <div className="container">
                {/* Top Section: Subscribe & App Download */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '2rem',
                    marginBottom: '3rem',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '2rem'
                }}>
                    {/* Brand & Subscribe */}
                    <div style={{ maxWidth: '400px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>GauGyan</h3>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>PRODUCTIONS LLP</div>
                                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '4px', opacity: 0.9 }}>{footerSettings.description}</div>
                            </div>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Subscribe</h4>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>Get 10% off your first order</p>

                        <div style={{
                            display: 'flex',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            padding: '4px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            maxWidth: '300px'
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px',
                                    flex: 1,
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0 8px'
                            }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Community CTA */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Join Community</h4>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>Connect with like-minded people.</p>
                        <Link to="/community" style={{
                            backgroundColor: 'white',
                            color: '#F97316',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            display: 'inline-block',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginBottom: '1rem'
                        }}>
                            Join Now
                        </Link>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="https://www.facebook.com/p/Gau-Gyan-World-61561957117221/" target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'white', opacity: 0.9, transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Facebook size={18} />
                                </a>
                                <a href="https://www.instagram.com/gaugyanworld/" target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'white', opacity: 0.9, transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Instagram size={18} />
                                </a>
                                <a href="https://www.youtube.com/@GaugyanWorld" target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'white', opacity: 0.9, transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Youtube size={18} />
                                </a>
                                <a href="https://x.com/GaugyanWorld" target="_blank" rel="noopener noreferrer"
                                    style={{ color: 'white', opacity: 0.9, transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <Twitter size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Download App */}
                    {/* Download App Removed per request */}
                </div>

                {/* Middle Section: 5 Columns Links */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* Column 1: Learning */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Learning</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/courses" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Courses</Link></li>
                            <li><Link to="/exams" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Exams</Link></li>
                            <li><Link to="/quizzes" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Quizzes</Link></li>
                            <li><Link to="/knowledgebase" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Knowledge Base</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Entertainment */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Entertainment</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/music" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Music</Link></li>
                            <li><Link to="/podcast" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Podcasts</Link></li>
                            <li><Link to="/meditation" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Meditation</Link></li>
                            <li><Link to="/entertainment" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>All Entertainment</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Resources</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/gaushala" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Find Gaushalas</Link></li>
                            <li><Link to="/shop" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Shop Products</Link></li>
                            <li><Link to="/news" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>News & Updates</Link></li>
                            <li><Link to="/community" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Community</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li><Link to="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>About Us</Link></li>
                            <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Contact Us</Link></li>
                            <li><Link to="/feedback" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Feedback</Link></li>
                            <li><Link to="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Privacy Policy</Link></li>
                            <li><Link to="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem', opacity: 0.9 }}>Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '10px', opacity: 0.9, fontSize: '0.95rem' }}>
                                <Mail size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ wordBreak: 'break-all' }}>{footerSettings.contact?.email || 'info@gaugyan.com'}</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', opacity: 0.9, fontSize: '0.95rem' }}>
                                <Phone size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{footerSettings.contact?.phone || '+91 6367176883'}</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', opacity: 0.9, fontSize: '0.95rem' }}>
                                <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ whiteSpace: 'pre-line' }}>{footerSettings.contact?.address || 'Plot No-20, Bhairu Nagar, Hathoj,\nKalwar Road, Jhotwara Jaipur-302012'}</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', opacity: 0.9, fontSize: '0.95rem', marginTop: '8px' }}>
                                <span style={{ fontWeight: 600 }}>GST No:</span>
                                <span>{footerSettings.contact?.gst || '08ABBFG3554F1ZK'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Social & Copyright */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {/* Social Links Updated */}
                        <a href="https://www.facebook.com/p/Gau-Gyan-World-61561957117221/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.9 }}><Facebook size={20} /></a>
                        <a href="https://x.com/GaugyanWorld" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.9 }}><Twitter size={20} /></a>
                        <a href="https://www.instagram.com/gaugyanworld/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.9 }}><Instagram size={20} /></a>
                        <a href="https://www.youtube.com/@GaugyanWorld" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.9 }}><Youtube size={20} /></a>
                    </div>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>&copy; {new Date().getFullYear()} Gaugyan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
