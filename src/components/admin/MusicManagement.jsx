import React, { useState } from 'react';
import { useData } from '../../context/useData';
import DataTable from './shared/DataTable';
import FormModal from '../../components/FormModal';
import { Music, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MusicManagement = () => {
    const {
        music,
        addMusic,
        deleteMusic,
        updateMusic,
        musicAlbums,
        musicGenres,
        musicMoods
    } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAudio, setActiveAudio] = useState(null);

    const initialFormData = {
        title: '',
        artist: '',
        album: '',
        genre: '',
        mood: '',
        duration: '',
        audioUrl: '',
        coverArt: '',
        description: '',
        status: 'pending'
    };

    const handleEdit = (track) => {
        setEditingItem(track);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this track?')) {
            await deleteMusic(id);
            toast.success('Track deleted successfully');
        }
    };

    const handlePlayPreview = (url) => {
        if (activeAudio === url) {
            setActiveAudio(null);
        } else {
            setActiveAudio(url);
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
        { key: 'artist', label: 'Artist', sortable: true },
        { key: 'genre', label: 'Genre', sortable: true },
        { key: 'mood', label: 'Mood', sortable: true },
        {
            key: 'status', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'approved' ? 'bg-green-100 text-green-800' :
                    row.status === 'rejected' ? 'bg-red-100 text-red-800' :
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
                        onClick={() => handlePlayPreview(row.audioUrl)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        title="Preview"
                    >
                        {activeAudio === row.audioUrl ? <Pause size={18} /> : <Play size={18} />}
                    </button>
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
        { name: 'artist', label: 'Artist', type: 'text', required: true },
        { name: 'album', label: 'Album', type: 'select', options: musicAlbums?.map(a => a.name) || [] },
        { name: 'genre', label: 'Genre', type: 'select', options: musicGenres?.map(g => g.name) || [], required: true },
        { name: 'mood', label: 'Mood', type: 'select', options: musicMoods?.map(m => m.name) || [] },
        { name: 'duration', label: 'Duration (MM:SS)', type: 'text', required: true },
        { name: 'audioUrl', label: 'Audio URL', type: 'text', required: true },
        { name: 'coverArt', label: 'Cover Art URL', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Music className="w-6 h-6" />
                    Music Management
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Track
                </button>
            </div>

            <DataTable
                columns={columns}
                data={music}
                searchable
                onSearch={setSearchQuery}
                pagination
                itemsPerPage={10}
            />

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Track' : 'Add Track'}
                fields={fields}
                initialData={editingItem || initialFormData}
                onSubmit={async (formData) => {
                    if (editingItem) {
                        await updateMusic(editingItem.id || editingItem.id, formData);
                        toast.success('Track updated successfully');
                    } else {
                        await addMusic(formData);
                        toast.success('Track added successfully');
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default MusicManagement;
