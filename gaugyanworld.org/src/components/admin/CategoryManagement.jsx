import React, { useState } from 'react';
import { Plus, Layers, CheckCircle, XCircle, AlignLeft } from 'lucide-react';
import DataTable from './shared/DataTable';
import FormModal from './shared/FormModal';
import FileUploader from './shared/FileUploader';
import ToggleSwitch from './shared/ToggleSwitch';
import StatCard from './shared/StatCard';

import categoriesData from '../../data/categories.json';

const CategoryManagement = () => {
    const [categories, setCategories] = useState(categoriesData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        status: 'Active',
        description: ''
    });

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormData({ name: '', image: '', status: 'Active', description: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cat) => {
        setEditingCategory(cat);
        setFormData({ ...cat });
        setIsModalOpen(true);
    };

    const handleDelete = (cat) => {
        if (window.confirm('Delete this category?')) {
            setCategories(categories.filter(c => c.id !== cat.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
        } else {
            setCategories([...categories, { id: Date.now().toString(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            header: 'Category',
            accessor: 'name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100 text-indigo-600 font-bold text-xs">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {item.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {item.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Categories" value={categories.length} icon={Layers} color="purple" />
                <StatCard title="Active" value={categories.filter(c => c.status === 'Active').length} icon={CheckCircle} color="green" />
                <div className="flex items-center justify-end">
                    <button onClick={handleOpenAdd} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium">
                        <Plus size={20} /> Add Category
                    </button>
                </div>
            </div>

            <DataTable columns={columns} data={categories} onEdit={handleOpenEdit} onDelete={handleDelete} />

            <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'} onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <ToggleSwitch label="Active Status" checked={formData.status === 'Active'} onChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Inactive' })} />
                    <FileUploader label="Category Icon/Image" value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
                </div>
            </FormModal>
        </div>
    );
};

export default CategoryManagement;
