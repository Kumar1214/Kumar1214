import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import Button from '../../../components/Button';
import FormModal from '../../../components/FormModal';
import { Plus, Edit2, Trash2, Code, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState('all');
    const [modules, setModules] = useState([]);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({});

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get('/v1/email-templates');
            if (res.data.success) {
                setTemplates(res.data.data);
                // Extract unique modules
                const mods = ['all', ...new Set(res.data.data.map(t => t.module))];
                setModules(mods);
            }
        } catch (error) {
            console.error('Fetch templates error:', error);
            toast.error('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        try {
            await api.post('/v1/email-templates/seed');
            toast.success('Default templates generated');
            fetchTemplates();
        } catch (error) {
            console.error('Seed error:', error);
            toast.error('Failed to seed templates');
        }
    };

    const handleCreate = async (data) => {
        try {
            await api.post('/v1/email-templates', data);
            toast.success('Template created');
            setIsCreateOpen(false);
            fetchTemplates();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create template');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await api.put(`/v1/email-templates/${currentTemplate.id}`, data);
            toast.success('Template updated');
            setIsEditOpen(false);
            fetchTemplates();
        } catch (error) {
            console.error('Update template error:', error);
            toast.error('Failed to update template');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.delete(`/v1/email-templates/${id}`);
            toast.success('Template deleted');
            fetchTemplates();
        } catch (error) {
            console.error('Delete template error:', error);
            toast.error('Failed to delete template');
        }
    };

    const openEdit = (template) => {
        setCurrentTemplate(template);
        setIsEditOpen(true);
    };

    const filteredTemplates = activeModule === 'all'
        ? templates
        : templates.filter(t => t.module === activeModule);

    // Fields for Create Form
    const createFields = [
        { name: 'name', label: 'Template Name', required: true, placeholder: 'e.g. Summer Sale' },
        { name: 'slug', label: 'Slug (Unique ID)', required: true, placeholder: 'e.g. summer_sale_2025' },
        { name: 'module', label: 'Module', required: true, type: 'select', options: ['general', 'auth', 'ecommerce', 'marketing', 'partners', 'admin', 'official'] },
        { name: 'subject', label: 'Email Subject', required: true },
        { name: 'content', label: 'HTML Content', type: 'textarea', required: true }
    ];

    // Fields for Edit Form (Slug is not editable)
    const editFields = [
        { name: 'name', label: 'Template Name', required: true },
        { name: 'subject', label: 'Email Subject', required: true },
        { name: 'module', label: 'Module', type: 'select', options: ['general', 'auth', 'ecommerce', 'marketing', 'partners', 'admin', 'official'] },
        { name: 'active', label: 'Is Active', type: 'checkbox' }, // Note: FormModal might need checkbox support update, or use boolean dropdown
        { name: 'content', label: 'HTML Content', type: 'textarea', required: true }
    ];

    if (loading) return <div className="p-8">Loading templates...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="text-blue-600" /> Email Templates
                    </h1>
                    <p className="text-gray-500">Manage transactional and marketing email layouts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSeed} title="Reset/Generate Defaults">
                        <RefreshCw size={18} />
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus size={18} className="mr-2" />
                        Create Template
                    </Button>
                </div>
            </div>

            {/* Module Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {modules.map(mod => (
                    <button
                        key={mod}
                        onClick={() => setActiveModule(mod)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                            ${activeModule === mod
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {mod}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 border-b border-gray-50 bg-gray-50 flex justify-between items-start">
                            <h3 className="font-semibold text-gray-800">{template.name}</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                                {template.module}
                            </span>
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-gray-500 mb-2">Subject:</div>
                            <div className="font-medium text-gray-900 mb-4 line-clamp-1">{template.subject}</div>

                            <div className="text-xs text-gray-400 mb-4 font-mono bg-gray-50 p-2 rounded">
                                ID: {template.slug}
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-400">
                                    {template.variables?.length > 0 ? `${template.variables.length} variables` : 'No variables'}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(template)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Code size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No templates found in this module.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <FormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Template"
                fields={createFields}
                onSubmit={handleCreate}
                submitText="Create Template"
            />

            {/* Edit Modal */}
            <FormModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={`Edit: ${currentTemplate.name}`}
                fields={editFields}
                initialData={currentTemplate}
                onSubmit={handleUpdate}
                submitText="Save Changes"
            />
        </div>
    );
};

export default EmailTemplates;
