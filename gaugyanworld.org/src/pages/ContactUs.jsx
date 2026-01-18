import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Input from '../components/Input';
import { useData } from '../context/useData';

const ContactUs = () => {
    const { addContactMessage } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            addContactMessage(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                padding: '3rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Get In Touch</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="container mt-lg">
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr', gap: 'var(--spacing-2xl)' }}>

                    {/* Contact Form */}
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)' }}>Send us a Message</h2>

                        {submitted && (
                            <div style={{
                                backgroundColor: '#D1FAE5',
                                color: '#065F46',
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                Thank you! Your message has been sent successfully.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />

                            <Input
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="What is this regarding?"
                            />

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    color: 'var(--color-text-main)'
                                }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell us more about your inquiry..."
                                    style={{
                                        width: '100%',
                                        padding: 'var(--spacing-sm)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <div className="card" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>Contact Information</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFF7ED',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Mail size={20} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Email</div>
                                        <a href="mailto:support@gaugyan.com" style={{ color: 'var(--color-primary)' }}>
                                            info@gaugyan.com
                                        </a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFF7ED',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Phone size={20} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Phone</div>
                                        <a href="tel:+911234567890" style={{ color: 'var(--color-primary)' }}>
                                            +91 6367176883
                                        </a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#FFF7ED',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <MapPin size={20} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Address</div>
                                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                            <strong>Gaugyan Productions LLP</strong><br />
                                            Plot No-20, Bhairu Nagar, Hathoj,<br />
                                            Kalwar Road, Jhotwara Jaipur-302012<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Office Hours</h3>
                            <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                                <p><strong>Sunday:</strong> Closed</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Map Section */}
                <div style={{ marginTop: 'var(--spacing-3xl)', marginBottom: 'var(--spacing-3xl)' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>Find Us</h2>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                    }}>
                        {/* Placeholder for Google Maps */}
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBfdb4fxvQPnkAbr_qEnOE2TgGKEjYHTI4&q=Gaugyan+Productions+LLP,Jaipur,India`}
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;
