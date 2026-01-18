import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Search, Award } from 'lucide-react';
import { certificateService } from '../services/api';

const CertificateVerification = () => {
    const { serialNumber: paramSerial } = useParams();
    const [serial, setSerial] = useState(paramSerial || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (paramSerial) {
            handleVerify(paramSerial);
        }
    }, [paramSerial]);

    const handleVerify = async (serialToVerify) => {
        if (!serialToVerify) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await certificateService.verifyCertificate(serialToVerify);
            if (response.data.success) {
                setResult(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Certificate not found or invalid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <img
                        className="mx-auto h-20 w-auto"
                        src="/assets/logo.png"
                        alt="GauGyan"
                        onError={(e) => e.target.src = "/gaugyan-logo.png"}
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Certificate Verification</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the Certificate Serial Number below to verify authenticity.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            className="focus:ring-primary focus:border-primary block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md py-3 border"
                            placeholder="e.g. GG1001"
                        />
                        <button
                            onClick={() => handleVerify(serial)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center bg-primary hover:bg-primary-dark text-white rounded-r-md transition-colors"
                        >
                            <Search size={20} />
                        </button>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {result && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                                <div>
                                    <h3 className="text-lg font-bold text-green-900">Valid Certificate</h3>
                                    <p className="text-xs text-green-700">Serial No: {result.serialNumber}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p><span className="font-semibold">Student Name:</span> {result.studentName}</p>
                                <p><span className="font-semibold">Course:</span> {result.courseName}</p>
                                <p><span className="font-semibold">Completion Date:</span> {new Date(result.completionDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 animate-fade-in text-center">
                            <XCircle className="text-red-600 mx-auto mb-2" size={48} />
                            <h3 className="text-lg font-bold text-red-900 mb-1">Invalid Certificate</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm font-medium text-primary hover:text-primary-light">
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} GauGyan. All rights reserved.
            </div>
        </div>
    );
};

export default CertificateVerification;
