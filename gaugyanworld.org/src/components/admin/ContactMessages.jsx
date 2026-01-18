import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Calendar, Mail, User, Clock, CheckSquare, Square, Filter, RefreshCw } from 'lucide-react';
import StatCard from './shared/StatCard';
import FormModal from './shared/FormModal';
import api from '../../services/api';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [viewingMessage, setViewingMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMessages = React.useCallback(async () => {
        try {
            const response = await api.get('/contact');
            if (response.status === 200) {
                return response.data;
            } else {
                // Fallback to mock data if API fails (or not running)
                return [
                    { id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Course Inquiry', message: 'I want to know more about the Ayurveda course.', status: 'new', createdAt: '2024-11-28T10:00:00Z' },
                    { id: '2', name: 'Jane Smith', email: 'jane@example.com', subject: 'Payment Issue', message: 'I tried to pay but it failed.', status: 'read', createdAt: '2024-11-29T14:30:00Z' },
                    { id: '3', name: 'Amit Kumar', email: 'amit@example.com', subject: 'Partnership', message: 'We are interested in partnering with GauGyan.', status: 'replied', createdAt: '2024-11-30T09:15:00Z' }
                ];
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }, []);

    const handleRefresh = async () => {
        const data = await fetchMessages();
        setMessages(data);
    };

    // Mock data for initial development - replace with API call
    useEffect(() => {
        let isMounted = true;
        fetchMessages().then(data => {
            if (isMounted) {
                setMessages(data);
            }
        });
        return () => { isMounted = false; };
    }, [fetchMessages]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/${id}`);
                setMessages(messages.filter(m => m.id !== id));
                setSelectedIds(selectedIds.filter(sid => sid !== id));
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) {
            try {
                await api.post('/contact/bulk-delete', { ids: selectedIds });
                setMessages(messages.filter(m => !selectedIds.includes(m.id)));
                setSelectedIds([]);
            } catch (error) {
                console.error('Error bulk deleting:', error);
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredMessages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredMessages.map(m => m.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleView = (message) => {
        setViewingMessage(message);
        setIsModalOpen(true);
        // Mark as read logic could go here
    };

    const filteredMessages = messages.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = filterDate ? item.createdAt.startsWith(filterDate) : true;

        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Messages" value={messages.length} icon={Mail} color="blue" />
                <StatCard title="New Messages" value={messages.filter(m => m.status === 'new').length} icon={Clock} color="green" />
                <StatCard title="Replied" value={messages.filter(m => m.status === 'replied').length} icon={CheckSquare} color="indigo" />
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            <Trash2 size={18} />
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-12">
                                    <button onClick={toggleSelectAll} className="text-gray-500 hover:text-indigo-600">
                                        {selectedIds.length === filteredMessages.length && filteredMessages.length > 0 ? (
                                            <CheckSquare size={20} />
                                        ) : (
                                            <Square size={20} />
                                        )}
                                    </button>
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(msg.id) ? 'bg-indigo-50/50' : ''}`}>
                                        <td className="p-4">
                                            <button onClick={() => toggleSelect(msg.id)} className={`text-gray-400 hover:text-indigo-600 ${selectedIds.includes(msg.id) ? 'text-indigo-600' : ''}`}>
                                                {selectedIds.includes(msg.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                            </button>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                            <span className="block text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{msg.name}</p>
                                                    <p className="text-xs text-gray-500">{msg.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">{msg.subject}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${msg.status === 'new' ? 'bg-green-100 text-green-700' :
                                                msg.status === 'read' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(msg)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Message"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">
                                        No messages found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Message Details"
                onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}
                size="md"
            >
                {viewingMessage && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold flex-shrink-0">
                                {viewingMessage.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{viewingMessage.subject}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <User size={14} />
                                    <span className="font-medium text-gray-700">{viewingMessage.name}</span>
                                    <span>&bull;</span>
                                    <Mail size={14} />
                                    <span>{viewingMessage.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    <Clock size={12} />
                                    {new Date(viewingMessage.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Content</label>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {viewingMessage.message}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Close
                            </button>
                            <a
                                href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
                            >
                                <Mail size={16} />
                                Reply via Email
                            </a>
                        </div>
                    </div>
                )}
            </FormModal>
        </div>
    );
};

export default ContactMessages;
