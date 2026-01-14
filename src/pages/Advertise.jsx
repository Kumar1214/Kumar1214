import React, { useState } from 'react';
import { Check, Star, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { useData } from '../context/useData';

const Advertise = () => {
    const { addAdvertisement } = useData();
    const [submitted, setSubmitted] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        description: ''
    });

    const PACKAGES = [
        {
            id: 'starter',
            name: 'Starter Package',
            price: '₹2,999',
            duration: '1 Month',
            features: [
                'Listing in Business Directory',
                'Basic Profile Page',
                '1 Social Media Mention',
                'Email Support'
            ],
            color: '#E0F2FE',
            accent: '#0284C7',
            popular: false
        },
        {
            id: 'growth',
            name: 'Growth Package',
            price: '₹7,999',
            duration: '3 Months',
            features: [
                'Featured Listing in Directory',
                'Enhanced Profile with Gallery',
                '3 Social Media Mentions',
                'Newsletter Feature',
                'Priority Support'
            ],
            color: '#F3E8FF',
            accent: '#9333EA',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise Package',
            price: '₹14,999',
            duration: '6 Months',
            features: [
                'Top Banner Placement',
                'Premium Profile Page',
                'Weekly Social Media Mentions',
                'Dedicated Newsletter Blast',
                '24/7 Priority Support',
                'Analytics Dashboard'
            ],
            color: '#FEF3C7',
            accent: '#D97706',
            popular: false
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAd = {
            ...formData,
            package: selectedPackage ? selectedPackage.name : 'Custom Inquiry',
            status: 'pending',
            date: new Date().toISOString()
        };
        addAdvertisement(newAd);
        setSubmitted(true);
        setFormData({
            businessName: '',
            contactPerson: '',
            email: '',
            phone: '',
            website: '',
            description: ''
        });
        setSelectedPackage(null);
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Hero Section */}
            <div style={{
                backgroundColor: '#1E3A8A',
                color: 'white',
                padding: '80px 20px',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.8)), url(https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1920)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
                        Grow Your Business with GauGyan
                    </h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '40px', lineHeight: 1.6 }}>
                        Reach thousands of conscious consumers, Gaushala owners, and spiritual seekers.
                        Showcase your products and services to a targeted audience.
                    </p>
                    <button
                        onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            padding: '16px 32px',
                            backgroundColor: '#F97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        View Packages <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container" style={{ padding: '60px 20px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    textAlign: 'center'
                }}>
                    <div style={{ padding: '20px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#2563EB' }}>
                            <Users size={30} />
                        </div>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1F2937', marginBottom: '5px' }}>50K+</h3>
                        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Active Monthly Users</p>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669' }}>
                            <Globe size={30} />
                        </div>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1F2937', marginBottom: '5px' }}>100+</h3>
                        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Cities Covered</p>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#D97706' }}>
                            <TrendingUp size={30} />
                        </div>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1F2937', marginBottom: '5px' }}>3x</h3>
                        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Average ROI</p>
                    </div>
                </div>
            </div>

            {/* Packages Section */}
            <div id="packages" style={{ backgroundColor: '#F9FAFB', padding: '80px 20px' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '15px' }}>
                            Choose Your Advertising Plan
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
                            Select a package that suits your business needs and budget. Transparent pricing with no hidden costs.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {PACKAGES.map(pkg => (
                            <div
                                key={pkg.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    padding: '40px',
                                    boxShadow: pkg.popular ? '0 20px 40px -10px rgba(147, 51, 234, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    border: pkg.popular ? `2px solid ${pkg.accent}` : '1px solid #E5E7EB',
                                    position: 'relative',
                                    transform: pkg.popular ? 'scale(1.05)' : 'scale(1)',
                                    zIndex: pkg.popular ? 10 : 1
                                }}
                            >
                                {pkg.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: pkg.accent,
                                        color: 'white',
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Star size={14} fill="white" /> Most Popular
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '10px' }}>{pkg.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: pkg.accent }}>{pkg.price}</span>
                                    <span style={{ color: '#6B7280' }}>/ {pkg.duration}</span>
                                </div>
                                <p style={{ color: '#6B7280', marginBottom: '30px', fontSize: '0.95rem' }}>
                                    Perfect for small businesses looking to establish an online presence.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4B5563' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: pkg.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: pkg.accent,
                                                flexShrink: 0
                                            }}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => {
                                        setSelectedPackage(pkg);
                                        document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        backgroundColor: pkg.popular ? pkg.accent : 'white',
                                        color: pkg.popular ? 'white' : pkg.accent,
                                        border: `2px solid ${pkg.accent}`,
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!pkg.popular) {
                                            e.currentTarget.style.backgroundColor = pkg.accent;
                                            e.currentTarget.style.color = 'white';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!pkg.popular) {
                                            e.currentTarget.style.backgroundColor = 'white';
                                            e.currentTarget.style.color = pkg.accent;
                                        }
                                    }}
                                >
                                    Select Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div id="contact-form" className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1F2937', marginBottom: '10px' }}>
                            Start Your Campaign
                        </h2>
                        <p style={{ color: '#6B7280' }}>
                            Fill out the form below and our marketing team will get back to you within 24 hours.
                        </p>
                    </div>

                    {submitted ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            backgroundColor: '#ECFDF5',
                            borderRadius: '16px',
                            color: '#065F46'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#D1FAE5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: '#059669'
                            }}>
                                <Check size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>Request Submitted!</h3>
                            <p>Thank you for your interest. We will contact you shortly to finalize your advertisement plan.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 20px',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Submit Another Request
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                            {selectedPackage && (
                                <div style={{
                                    padding: '15px',
                                    backgroundColor: '#EFF6FF',
                                    borderRadius: '8px',
                                    border: '1px solid #BFDBFE',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: '#1E40AF'
                                }}>
                                    <span style={{ fontWeight: 600 }}>Selected Plan: {selectedPackage.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPackage(null)}
                                        style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                                    >
                                        Change
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Business Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
                                        placeholder="e.g. Vedic Organics"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Contact Person *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Website (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Message / Requirements</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', resize: 'vertical' }}
                                    placeholder="Tell us about your advertising goals..."
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    backgroundColor: '#F97316',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                            >
                                Submit Request
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Advertise;
