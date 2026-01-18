import React from 'react';
import { X, Download, Printer, FileText, CheckCircle, Trash2, Eye } from 'lucide-react';
import Button from '../../../components/Button';

const PayoutDetailModal = ({ payout, onClose, onApprove, onDelete }) => {
    if (!payout) return null;

    // Mock Invoices Data relevant to this payout
    const invoices = [
        { id: 'INV-001', date: '2024-11-01', amount: 5000, status: 'Settled' },
        { id: 'INV-005', date: '2024-11-15', amount: 3000, status: 'Settled' },
        { id: 'INV-009', date: '2024-11-20', amount: payout.amount - 8000, status: 'Settled' },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Payout Details</h2>
                        <p className="text-sm text-gray-500">REF: #{payout.id} • {payout.period}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* Summary Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">Total Payout Amount</p>
                            <h3 className="text-3xl font-bold text-blue-900">₹{payout.amount.toLocaleString()}</h3>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    payout.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {payout.status}
                            </span>
                            <p className="text-xs text-blue-700">Requested: {payout.requestDate}</p>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Beneficiary Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 border rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Name</span>
                                <span className="font-semibold text-gray-800">{payout.vendorName}</span>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Type</span>
                                <span className="font-semibold text-gray-800 capitalize">{payout.type}</span>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Bank Account</span>
                                <span className="font-semibold text-gray-800">XXXX-XXXX-4582</span>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <span className="block text-gray-500 text-xs mb-1">Tax ID</span>
                                <span className="font-semibold text-gray-800">GSTIN123456789</span>
                            </div>
                        </div>
                    </div>

                    {/* Invoice List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Relevant Invoices</h4>
                            <div className="flex gap-2">
                                <button className="text-gray-500 hover:text-gray-700 p-1" title="Download All"><Download size={16} /></button>
                                <button onClick={handlePrint} className="text-gray-500 hover:text-gray-700 p-1" title="Print List"><Printer size={16} /></button>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Invoice ID</th>
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold text-right">Amount</th>
                                        <th className="px-4 py-3 font-semibold text-center">Status</th>
                                        <th className="px-4 py-3 font-semibold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.map((inv, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-blue-600">{inv.id}</td>
                                            <td className="px-4 py-3 text-gray-600">{inv.date}</td>
                                            <td className="px-4 py-3 text-right font-medium">₹{inv.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Settled</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-gray-400 hover:text-gray-600"><FileText size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between gap-4">
                    <Button onClick={onClose} className="!bg-white !text-gray-700 hover:!bg-gray-100 border border-gray-200">
                        Close
                    </Button>
                    <div className="flex gap-3">
                        {payout.status === 'pending' && (
                            <>
                                <Button onClick={() => { onDelete(payout.id); onClose(); }} className="bg-red-50 text-red-600 hover:bg-red-100 border-none flex items-center gap-2">
                                    <Trash2 size={16} /> Delete Request
                                </Button>
                                <Button onClick={() => { onApprove(payout.id); onClose(); }} className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2">
                                    <CheckCircle size={16} /> Approve Payout
                                </Button>
                            </>
                        )}
                        {payout.status === 'completed' && (
                            <Button className="bg-gray-200 text-gray-500 cursor-not-allowed flex items-center gap-2">
                                <CheckCircle size={16} /> Paid
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutDetailModal;
