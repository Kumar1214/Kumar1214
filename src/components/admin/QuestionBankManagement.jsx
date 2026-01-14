import React, { useState } from 'react';
import { Plus, Trash2, Edit, FileText, Download } from 'lucide-react';
import { useData } from '../../context/useData';
import FormModal from '../FormModal';
import FileUploader from '../FileUploader';

const QuestionBankManagement = () => {
    const { questionBanks, addQuestionBank, deleteQuestionBank, updateQuestionBank } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                <h3>Question Bank (PDF Library)</h3>
                <button onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <Plus size={18} /> Add Question Paper
                </button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.9rem', color: '#6B7280' }}>Title</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.9rem', color: '#6B7280' }}>Category</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.9rem', color: '#6B7280' }}>Year</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.9rem', color: '#6B7280' }}>File</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.9rem', color: '#6B7280' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionBanks.map(bank => (
                            <tr key={bank.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                                    <div>{bank.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{bank.description}</div>
                                </td>
                                <td style={{ padding: '16px 24px' }}><span style={{ padding: '4px 12px', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '12px', fontSize: '0.8rem' }}>{bank.category}</span></td>
                                <td style={{ padding: '16px 24px', color: '#6B7280' }}>{bank.year}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    {bank.fileUrl ? (
                                        <a href={bank.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                            <FileText size={16} /> View PDF
                                        </a>
                                    ) : (
                                        <span style={{ color: '#9CA3AF' }}>No File</span>
                                    )}
                                </td>
                                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEdit(bank)} style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => deleteQuestionBank(bank.id)} style={{ padding: '6px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <FormModal isOpen={showModal} onClose={() => setShowModal(false)} title={editingBank ? 'Edit Question Paper' : 'Add Question Paper'} onSubmit={handleSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option>Ayurveda</option>
                            <option>Yoga</option>
                            <option>General Knowledge</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Year</label>
                        <input type="text" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', minHeight: '60px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>PDF File *</label>
                    <FileUploader
                        value={formData.fileUrl}
                        onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                        accept=".pdf"
                        label="Upload Question Paper (PDF)"
                    />
                </div>
            </FormModal>
        </div>
    );
};

export default QuestionBankManagement;
