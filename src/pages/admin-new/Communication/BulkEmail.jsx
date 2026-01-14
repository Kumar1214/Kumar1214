import React, { useState } from 'react';
import api from '../../../utils/api';
import { Send, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const BulkEmail = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: 'all',
        subject: '',
        message: ''
    });

    const roles = [
        { value: 'all', label: 'All Users (Everyone)' },
        { value: 'user', label: 'Regular Users' },
        { value: 'vendor', label: 'Vendors Only' },
        { value: 'gaushala_owner', label: 'Gaushala Owners' },
        { value: 'artist', label: 'Artists' },
        { value: 'author', label: 'Authors' },
        { value: 'instructor', label: 'Instructors' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Are you sure you want to send this email to ${formData.role === 'all' ? 'EVERYONE' : formData.role + 's'}?`)) return;

        setLoading(true);
        try {
            const res = await api.post('/communication/bulk-email', formData);
            if (res.data.success) {
                toast.success(res.data.message);
                setFormData({ ...formData, subject: '', message: '' });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send bulk email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Users className="h-8 w-8" />
                        Bulk Email sender
                    </h1>
                    <p className="text-indigo-100 mt-2 opacity-90">
                        Send announcements, newsletters, and updates to your community.
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Audience Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                            <div className="grid md:grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`
                                            cursor-pointer border rounded-lg p-4 flex items-center gap-3 transition-all
                                            ${formData.role === role.value
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                                                : 'border-gray-200 hover:border-gray-300'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={formData.role === role.value}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.role === role.value ? 'border-indigo-600' : 'border-gray-400'}`}>
                                            {formData.role === role.value && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                        </div>
                                        <span className="font-medium text-sm">{role.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="e.g., Important Update Regarding Platform Policies"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Message Body */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message Body <span className="text-xs font-normal text-gray-500 ml-2">(HTML Supported)</span>
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Type your message here... Use HTML tags for formatting if needed. &#10;Example: <h1>Hello {{name}}</h1>"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                                rows={12}
                                required
                            />
                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                <span className="bg-gray-100 px-2 py-1 rounded">Tip:</span>
                                Use <code>{'{{name}}'}</code> to dynamically insert the user's name.
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                            <div>
                                <strong className="font-semibold block mb-1">Please Note:</strong>
                                This action will place emails in a queue. Delivery times may vary based on the number of recipients. Ensure your SMTP settings are correctly configured before sending.
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5
                                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl'}
                                `}
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Blast
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default BulkEmail;
