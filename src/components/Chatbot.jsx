import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../services/api';

const Chatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState(() => [
        { id: 1, text: 'Hello! Welcome to Gaugyan LMS. How can I help you today?', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const quickReplies = [
        { label: 'Browse Courses', action: 'browse_courses' },
        { label: 'Contact Support', action: 'contact_support' },
        { label: 'Track Order', action: 'track_order' },
        { label: 'Find Gaushala', action: 'find_gaushala' }
    ];

    const generateBotResponse = async (userText) => {
        const lowerInput = userText.toLowerCase();

        // 1. Navigation / Quick Action Intent
        if (lowerInput.includes('course') || lowerInput.includes('browse')) {
            navigate('/courses');
            return "I've taken you to our **Courses** page. We offer courses in Ayurveda, Yoga, and Vedic Studies. Anything specific you are looking for?";
        }
        if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('help')) {
            navigate('/contact');
            return "You can reach our support team directly via the **Contact Us** page. Or email us at support@gaugyan.com.";
        }
        if (lowerInput.includes('order') || lowerInput.includes('track')) {
            navigate('/my-orders');
            return "I've navigated you to **My Orders**. You can view your order status and history there. Please log in if you haven't.";
        }
        if (lowerInput.includes('gaushala') || lowerInput.includes('cow') || lowerInput.includes('shelter')) {
            navigate('/gaushala');
            return "Explore our partner **Gaushalas** here. You can find shelters near you to visit or support.";
        }

        // 2. Greetings
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'namaste'];
        if (greetings.some(g => lowerInput === g || lowerInput.startsWith(g + ' '))) {
            return "Namaste! 🙏 How can I assist you with your learning journey or Gau Seva today?";
        }

        // 3. Knowledge Base Search
        try {
            if (userText.length > 2) {
                const response = await contentService.getArticles({ search: userText, limit: 1 });
                const articles = response.data?.data || response.data || [];
                if (articles.length > 0) {
                    const article = articles[0];
                    // Strip HTML tags for clean display
                    const cleanContent = article.excerpt?.replace(/<[^>]*>?/gm, '') || article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) || '';
                    return `Here is something I found about "${article.title}":\n\n${cleanContent}...\n\n[Read more](/knowledgebase/${article.id || article.id})`;
                }
            }
        } catch (err) {
            console.error("KB Search failed:", err);
        }

        // 4. Fallback
        return "I'm not sure about that, but I can help you find courses, products, or Gaushalas. You can also try searching our Knowledge Base from the menu.";
    };

    const handleSend = async (text = inputMessage) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: text,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        // Process response
        const responseText = await generateBotResponse(text);

        // Enhance response (handling markdown links if needed, simplistic approach here)
        // Ideally render markdown, but here we just pass text.

        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800);
    };

    const handleQuickAction = (action) => {
        let text = "";
        switch (action) {
            case 'browse_courses': text = "I want to browse courses"; break;
            case 'contact_support': text = "Contact support"; break;
            case 'track_order': text = "Track my order"; break;
            case 'find_gaushala': text = "Find a Gaushala"; break;
            default: text = action;
        }
        handleSend(text);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid white' }}></div>
                <MessageCircle size={28} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: isMinimized ? 'auto' : '600px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: 'var(--font-primary)'
        }}>
            {/* Header */}
            <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                        G
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>Gaugyan Assistant</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                            Online
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '50%', transition: 'background 0.2s' }} className="hover:bg-white/10">
                        <Minimize2 size={18} />
                    </button>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', borderRadius: '50%', transition: 'background 0.2s' }} className="hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '16px',
                        overflowY: 'auto',
                        backgroundColor: '#F3F4F6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {messages.map(message => (
                            <div key={message.id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '100%'
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '12px 16px',
                                    borderRadius: message.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                    backgroundColor: message.sender === 'user' ? 'var(--color-primary)' : 'white',
                                    color: message.sender === 'user' ? 'white' : '#1F2937',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    {/* Simple Markdown-like link parsing */}
                                    {message.text.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                                        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                                        if (linkMatch) {
                                            return <span key={i} onClick={() => navigate(linkMatch[2])} style={{ textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>{linkMatch[1]}</span>;
                                        }
                                        return part;
                                    })}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px', margin: '0 4px' }}>{message.time}</span>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: '4px', marginLeft: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '12px 12px 12px 0', width: 'fit-content' }}>
                                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9CA3AF' }}></span>
                                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9CA3AF', animationDelay: '0.2s' }}></span>
                                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9CA3AF', animationDelay: '0.4s' }}></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies (Only show if last message was bot) */}
                    {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !isTyping && (
                        <div style={{ padding: '12px 16px', backgroundColor: '#F3F4F6', borderTop: '1px solid #E5E7EB' }}>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</div>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {quickReplies.map((reply, idx) => (
                                    <button key={idx} onClick={() => handleQuickAction(reply.action)} style={{
                                        padding: '6px 12px',
                                        border: '1px solid #D1D5DB',
                                        backgroundColor: 'white',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        whiteSpace: 'nowrap',
                                        color: '#374151',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#374151'; }}
                                    >
                                        {reply.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: '16px',
                        borderTop: '1px solid #E5E7EB',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '24px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    backgroundColor: '#F9FAFB'
                                }}
                                onFocus={(e) => e.target.style.backgroundColor = 'white'}
                                onBlur={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                            />
                            <button onClick={() => handleSend()} disabled={!inputMessage.trim()} style={{
                                padding: '12px',
                                backgroundColor: inputMessage.trim() ? 'var(--color-primary)' : '#E5E7EB',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                cursor: inputMessage.trim() ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.2s'
                            }}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;
