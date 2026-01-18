import React, { useState } from 'react';
import { useData } from '../../context/useData';
import DataTable from './shared/DataTable';
import FormModal from '../../components/FormModal';
import { Mic, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PodcastManagement = () => {
    const {
        podcasts,
        addPodcast,
        deletePodcast,
        updatePodcast,
        podcastSeries,
        podcastCategories
    } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const initialFormData = {
        title: '',
        host: '',
        series: '',
        category: '',
        description: '',
        audioUrl: '',
        coverArt: '',
        duration: '',
        episodeNumber: '',
        season: '',
        status: 'pending'
    };

    const handleEdit = (podcast) => {
        setEditingItem(podcast);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this podcast?')) {
            await deletePodcast(id);
            toast.success('Podcast deleted successfully');
        }
    };

    const columns = [
        {
            key: 'coverArt',
            label: 'Cover',
            render: (row) => (
                <img
                    src={row.coverArt || 'https://via.placeholder.com/40'}
                    alt={row.title}
                    className="w-10 h-10 rounded object-cover"
                />
            )
        },
        { key: 'title', label: 'Title', sortable: true },
        { key: 'host', label: 'Host', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'series', label: 'Series', sortable: true },
        {
            key: 'status', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'published' ? 'bg-green-100 text-green-800' :
                    row.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
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
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'host', label: 'Host', type: 'text', required: true },
        { name: 'series', label: 'Series', type: 'select', options: podcastSeries?.map(s => s.name) || [], required: true },
        { name: 'category', label: 'Category', type: 'select', options: podcastCategories?.map(c => c.name) || [], required: true },
        { name: 'duration', label: 'Duration (HH:MM:SS)', type: 'text', required: true },
        { name: 'season', label: 'Season', type: 'number' },
        { name: 'episodeNumber', label: 'Episode No.', type: 'number' },
        { name: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
        { name: 'coverArt', label: 'Cover Art URL', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived', 'pending'] }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Mic className="w-6 h-6" />
                    Podcast Management
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Podcast
                </button>
            </div>

            <DataTable
                columns={columns}
                data={podcasts}
                searchable
                onSearch={setSearchQuery}
                pagination
                itemsPerPage={10}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Podcast' : 'Add Podcast'}
                fields={fields}
                initialData={editingItem || initialFormData}
                onSubmit={async (formData) => {
                    if (editingItem) {
                        await updatePodcast(editingItem.id || editingItem.id, formData);
                        toast.success('Podcast updated successfully');
                    } else {
                        await addPodcast(formData);
                        toast.success('Podcast added successfully');
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default PodcastManagement;
