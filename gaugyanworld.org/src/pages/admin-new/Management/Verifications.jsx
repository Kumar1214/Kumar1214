import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, XCircle, FileText, ExternalLink, User } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Verifications = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/verification/pending');
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch verification requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

        try {
            const { data } = await api.put(`/verification/${id}/action`, { action });
            if (data.success) {
                toast.success(data.message);
                fetchRequests(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-[#0c2d50] px-8 py-10 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-orange-400" />
                    Identity Verification
                </h1>
                <p className="text-blue-100 opacity-90">
                    Review and approve vendor and gaushala identity documents.
                </p>
            </div>

            <div className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full -mt-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <ShieldCheck size={48} className="mb-4 opacity-50" />
                            <p>No pending verification requests</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map(req => (
                                <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row gap-6 justify-between">

                                        {/* User Info */}
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                                {req.User?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{req.User?.name}</h3>
                                                <div className="text-sm text-gray-500">{req.User?.email}</div>
                                                <span className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                                                    {req.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Aadhar Card</div>
                                                <div className="font-mono text-sm mb-1">{req.aadharNumber}</div>
                                                <a href={req.aadharCardUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                                                    <ExternalLink size={12} /> View Document
                                                </a>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">PAN Card</div>
                                                <div className="font-mono text-sm mb-1">{req.panNumber}</div>
                                                <a href={req.panCardUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                                                    <ExternalLink size={12} /> View Document
                                                </a>
                                            </div>
                                            {req.gstNumber && (
                                                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">GST Cert</div>
                                                    <div className="font-mono text-sm mb-1">{req.gstNumber}</div>
                                                    <a href={req.gstCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                                                        <ExternalLink size={12} /> View Document
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 justify-center min-w-[120px]">
                                            <button
                                                onClick={() => handleAction(req.id, 'approve')}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'reject')}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Verifications;
