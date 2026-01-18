import React, { useState } from 'react';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';
import { useData } from '../../../context/useData';
import FormModal from '../../../components/admin/shared/FormModal';
import FileUploader from '../../../components/admin/shared/FileUploader';

const QuestionBank = () => {
    const { questionBanks, addQuestionBank, deleteQuestionBank, updateQuestionBank } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Ayurveda',
        year: new Date().getFullYear().toString(),
        fileUrl: '',
        description: ''
    });

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Ayurveda',
            year: new Date().getFullYear().toString(),
            fileUrl: '',
            description: ''
        });
        setEditingBank(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUploading) {
            alert("Please wait for the file to finish uploading before saving.");
            return;
        }
        if (!formData.fileUrl) {
            alert("Please upload a PDF file first.");
            return;
        }

        if (editingBank) {
            updateQuestionBank(editingBank.id, formData);
        } else {
            addQuestionBank(formData);
        }
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (bank) => {
        setEditingBank(bank);
        setFormData(bank);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Question Bank (PDF Library)</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2644] transition-colors shadow-sm"
                >
                    <Plus size={18} /> Add Question Paper
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {questionBanks.map(bank => (
                                <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{bank.title}</div>
                                        <div className="text-sm text-gray-500">{bank.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {bank.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{bank.year}</td>
                                    <td className="px-6 py-4">
                                        {bank.fileUrl ? (
                                            <a
                                                href={bank.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                <FileText size={16} /> View PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No File</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(bank)}
                                                className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteQuestionBank(bank.id)}
                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {questionBanks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>No question papers found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingBank ? 'Edit Question Paper' : 'Add Question Paper'}
                onSubmit={handleSubmit}
                disabled={isUploading}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                            >
                                <option>Ayurveda</option>
                                <option>Yoga</option>
                                <option>General Knowledge</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[80px]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PDF File *</label>
                        <FileUploader
                            value={formData.fileUrl}
                            onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                            onUploadStart={() => setIsUploading(true)}
                            onUploadEnd={() => setIsUploading(false)}
                            accept=".pdf"
                            label="Upload Question Paper (PDF)"
                        />
                    </div>
                </div>
                {isUploading && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        Wait for upload to complete...
                    </div>
                )}
            </FormModal>
        </div>
    );
};

export default QuestionBank;
