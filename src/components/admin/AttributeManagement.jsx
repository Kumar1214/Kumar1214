import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import DataTable from './shared/DataTable';
import FormModal from '../../components/FormModal';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AttributeManagement = ({
    title,
    icon: Icon,
    apiEndpoint,
    attributeName = 'attribute'
}) => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialFormData = {
        name: '',
        description: '',
        status: 'active'
    };

    // Helper to normalize endpoint (remove redundant /api prefix if present since api instance handles it)
    const getNormalizedEndpoint = useCallback(() => {
        return apiEndpoint.startsWith('/api/') ? apiEndpoint.substring(4) : apiEndpoint;
    }, [apiEndpoint]);

    // Fetch items
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = getNormalizedEndpoint();
            const response = await api.get(endpoint);
            const data = response.data;
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${attributeName}s:`, error);
            toast.error(`Failed to load ${attributeName}s`);
        } finally {
            setLoading(false);
        }
    }, [getNormalizedEndpoint, attributeName]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${attributeName}?`)) {
            try {
                const endpoint = getNormalizedEndpoint();
                const response = await api.delete(`${endpoint}/${id}`);
                if (response.status === 200) {
                    toast.success(`${attributeName} deleted successfully`);
                    fetchItems();
                }
            } catch (error) {
                console.error(`Error deleting ${attributeName}:`, error);
                toast.error(`Failed to delete ${attributeName}`);
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: false },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id || row.id)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    const fields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['active', 'inactive'],
            required: true
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    {Icon && <Icon className="w-6 h-6" />}
                    {title}
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add {attributeName}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={items}
                    searchable
                    pagination
                    itemsPerPage={10}
                />
            )}

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Edit ${attributeName}` : `Add ${attributeName}`}
                fields={fields}
                initialData={editingItem || initialFormData}
                onSubmit={async (formData) => {
                    try {
                        const endpoint = getNormalizedEndpoint();
                        const response = editingItem
                            ? await api.put(`${endpoint}/${editingItem.id}`, formData)
                            : await api.post(endpoint, formData);

                        const data = response.data;

                        if (data.success) {
                            toast.success(`${attributeName} ${editingItem ? 'updated' : 'created'} successfully`);
                            setIsModalOpen(false);
                            fetchItems();
                        } else {
                            toast.error(data.message || `Failed to save ${attributeName}`);
                        }
                    } catch (error) {
                        console.error(`Error saving ${attributeName}:`, error);
                        toast.error(`Failed to save ${attributeName}`);
                    }
                }}
            />
        </div>
    );
};

export default AttributeManagement;
