import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane, FaUser, FaRobot } from 'react-icons/fa';

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Welcome message
        setMessages([
            {
                id: 1,
                text: `Namaste ${user?.name || 'Friend'}! 🙏 Welcome to GauGyan Chat. How can I assist you today?`,
                sender: 'bot',
                timestamp: new Date(),
            },
        ]);
    }, [user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                text: 'Thank you for your message! Our chat feature is currently under development. For immediate assistance, please contact us at support@gaugyanworld.org or call +91 6307176583.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <FaRobot className="me-2" />
                                GauGyan Chat Support
                            </h4>
                            <small>Real-time assistance for your spiritual journey</small>
                        </div>

                        <div
                            className="card-body"
                            style={{
                                height: '500px',
                                overflowY: 'auto',
                                backgroundColor: '#f8f9fa',
                            }}
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                                        }`}
                                >
                                    <div
                                        className={`d-flex align-items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''
                                            }`}
                                        style={{ maxWidth: '70%' }}
                                    >
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center ${message.sender === 'user' ? 'ms-2' : 'me-2'
                                                }`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: message.sender === 'user' ? '#007bff' : '#28a745',
                                                color: 'white',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {message.sender === 'user' ? <FaUser /> : <FaRobot />}
                                        </div>
                                        <div>
                                            <div
                                                className={`p-3 rounded ${message.sender === 'user'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white border'
                                                    }`}
                                            >
                                                <p className="mb-0">{message.text}</p>
                                            </div>
                                            <small className="text-muted d-block mt-1">
                                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="d-flex mb-3">
                                    <div className="d-flex align-items-start">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                            }}
                                        >
                                            <FaRobot />
                                        </div>
                                        <div className="bg-white border p-3 rounded">
                                            <div className="typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="card-footer bg-white">
                            <form onSubmit={handleSendMessage}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type your message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!inputMessage.trim()}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="alert alert-info mt-3">
                        <strong>Note:</strong> This chat feature is currently in development. For immediate
                        assistance, please:
                        <ul className="mb-0 mt-2">
                            <li>Email: support@gaugyanworld.org</li>
                            <li>Phone: +91 6307176583</li>
                            <li>Address: Plot No-35, Brahma Nagar, Hathoj, Kanpur, Uttar Pradesh 208017</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #6c757d;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    );
};

export default Chat;
