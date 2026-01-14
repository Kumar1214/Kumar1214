import React from 'react';
import { Target, Eye, Heart, Users } from 'lucide-react';

const AboutUs = () => {
    const team = [
        { name: 'Dr. Rajesh Kumar', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300' },
        { name: 'Priya Sharma', role: 'Head of Content', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300' },
        { name: 'Amit Patel', role: 'Technology Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
        { name: 'Sunita Devi', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
    ];

    const values = [
        { icon: <Target size={32} />, title: 'Our Mission', description: 'To preserve and promote traditional Indian knowledge systems while empowering communities through education and sustainable practices centered around cow welfare.' },
        { icon: <Eye size={32} />, title: 'Our Vision', description: 'A world where ancient wisdom meets modern technology, creating sustainable livelihoods and healthier communities through Gau-based economy.' },
        { icon: <Heart size={32} />, title: 'Our Values', description: 'Compassion for all beings, reverence for traditional knowledge, commitment to sustainability, and dedication to community empowerment.' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>About Gaugyan</h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
                        Bridging ancient wisdom with modern education to create a sustainable future
                    </p>
                </div>
            </div>

            <div className="container mt-lg">

                {/* Mission, Vision, Values */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    {values.map((value, idx) => (
                        <div key={idx} className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <div style={{
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--spacing-md)',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {value.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>{value.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Our Story */}
                <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Our Story</h2>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                            Gaugyan was born from a simple yet powerful vision: to create a platform that honors India's rich heritage of cow-based sustainable living while providing modern educational tools and economic opportunities to communities.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                            Founded in 2020, we started as a small initiative to connect Gaushalas with conscious consumers. Today, we've grown into a comprehensive learning management system offering courses, entertainment, e-commerce, and community features—all centered around the principles of sustainability and traditional wisdom.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                            Our platform serves learners, educators, artists, Gaushala owners, and conscious consumers, creating a thriving ecosystem where knowledge, culture, and commerce intersect for the greater good.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                        <Users size={32} style={{ verticalAlign: 'middle', marginRight: '12px' }} />
                        Meet Our Team
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--spacing-xl)'
                    }}>
                        {team.map((member, idx) => (
                            <div key={idx} className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto var(--spacing-md)',
                                    border: '4px solid var(--color-primary)'
                                }}>
                                    <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{member.name}</h3>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    backgroundColor: '#FFF7ED',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-3xl)'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--spacing-xl)',
                        textAlign: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>50+</div>
                            <div style={{ color: 'var(--color-text-muted)' }}>Gaushalas Connected</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>10,000+</div>
                            <div style={{ color: 'var(--color-text-muted)' }}>Active Learners</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>200+</div>
                            <div style={{ color: 'var(--color-text-muted)' }}>Courses Available</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>5,000+</div>
                            <div style={{ color: 'var(--color-text-muted)' }}>Products Sold</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
