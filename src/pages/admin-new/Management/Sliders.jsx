
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, ChevronUp, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../../context/useData';
import ImageUploader from '../../../components/ImageUploader';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const generateId = () => Date.now();

const Sliders = () => {
    // Fallback to mock hooks if useData is not fully implemented for this context yet
    const { homeSliders, addHomeSlider, deleteHomeSlider, updateHomeSlider } = useData() || {
        homeSliders: [],
        addHomeSlider: () => { },
        deleteHomeSlider: () => { },
        updateHomeSlider: () => { }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSlider, setEditingSlider] = useState(null);
    const [filterLocation, setFilterLocation] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        order: 1,
        active: true,
        location: 'home'
    });

    // Local state for dev if context is empty
    const [localSliders, setLocalSliders] = useState([
        { id: 1, title: 'Welcome to GauGyan', subtitle: 'Ancient Wisdom', image: 'https://images.unsplash.com/photo-1544367563-12123d8959c9?auto=format&fit=crop&q=80', active: true, order: 1, location: 'home', buttonText: 'Explore Courses', buttonLink: '/courses' },
        { id: 2, title: 'Organic Products', subtitle: 'Pure & Natural', image: 'https://images.unsplash.com/photo-1615485925763-867862f8021a?auto=format&fit=crop&q=80', active: true, order: 2, location: 'shop', buttonText: 'Shop Now', buttonLink: '/shop' }
    ]);

    const activeSliders = homeSliders && homeSliders.length > 0 ? homeSliders : localSliders;

    const filteredSliders = activeSliders.filter(slider =>
        (filterLocation === 'all' || slider.location === filterLocation) &&
        (slider.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            slider.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const sortedSliders = [...filteredSliders].sort((a, b) => (a.order || 0) - (b.order || 0));

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            buttonText: '',
            buttonLink: '',
            order: (activeSliders.length || 0) + 1,
            active: true,
            location: 'home'
        });
        setEditingSlider(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeSliders === localSliders) {
                // Local State Logic
                if (editingSlider) {
                    setLocalSliders(localSliders.map(s => s.id === editingSlider.id ? { ...formData, id: s.id } : s));
                    toast.success('Slider updated in local state');
                } else {
                    const newId = generateId();
                    setLocalSliders([...localSliders, { ...formData, id: newId }]);
                    toast.success('Slider added to local state');
                }
            } else {
                // Context Logic
                let promise;
                if (editingSlider) {
                    promise = updateHomeSlider(editingSlider.id, formData);
                } else {
                    promise = addHomeSlider(formData);
                }

                await toast.promise(Promise.resolve(promise), {
                    loading: editingSlider ? 'Updating slider...' : 'Adding slider...',
                    success: editingSlider ? 'Slider updated!' : 'Slider added!',
                    error: 'Failed to save slider'
                });
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleEdit = (slider) => {
        setEditingSlider(slider);
        setFormData({
            title: slider.title || '',
            subtitle: slider.subtitle || '',
            description: slider.description || '',
            image: slider.image || '',
            buttonText: slider.buttonText || '',
            buttonLink: slider.buttonLink || '',
            order: slider.order || 1,
            active: slider.active !== undefined ? slider.active : true
        });
        setShowModal(true);
    };

    const handleDelete = async (slider) => {
        const result = await Swal.fire({
            title: `Delete "${slider.title}"?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            if (activeSliders === localSliders) {
                setLocalSliders(localSliders.filter(s => s.id !== slider.id));
                toast.success('Slider deleted from local state');
            } else {
                try {
                    await deleteHomeSlider(slider.id);
                    toast.success('Slider deleted successfully');
                } catch (error) {
                    toast.error('Failed to delete slider');
                }
            }
        }
    };

    const handleToggleActive = (slider) => {
        if (activeSliders === localSliders) {
            setLocalSliders(localSliders.map(s => s.id === slider.id ? { ...s, active: !s.active } : s));
        } else {
            updateHomeSlider(slider.id, { ...slider, active: !slider.active });
        }
    };

    const moveSlider = (slider, direction) => {
        // Simple swap logic for local state, complex re-indexing might be needed for real backend
        const currentIndex = activeSliders.findIndex(s => s.id === slider.id);
        if (currentIndex === -1) return;

        let newSliders = [...activeSliders];
        if (direction === 'up' && currentIndex > 0) {
            [newSliders[currentIndex], newSliders[currentIndex - 1]] = [newSliders[currentIndex - 1], newSliders[currentIndex]];
            // Update orders
            newSliders[currentIndex].order = currentIndex + 1;
            newSliders[currentIndex - 1].order = currentIndex;
        } else if (direction === 'down' && currentIndex < newSliders.length - 1) {
            [newSliders[currentIndex], newSliders[currentIndex + 1]] = [newSliders[currentIndex + 1], newSliders[currentIndex]];
            // Update orders
            newSliders[currentIndex].order = currentIndex + 1;
            newSliders[currentIndex + 1].order = currentIndex + 2;
        }

        if (activeSliders === localSliders) {
            setLocalSliders(newSliders);
        } else {
            // Depending on API, might need to update each modified slider
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-orange-300" />
                        Slider Management
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Manage homepage banners, promotional slides, and visual content.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Actions Bar */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search sliders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <select
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white w-full md:w-auto"
                            >
                                <option value="all">All Locations</option>
                                <option value="home">Home Page</option>
                                <option value="courses">Courses Page</option>
                                <option value="shop">Shop Page</option>
                            </select>

                            <button
                                onClick={() => { resetForm(); setShowModal(true); }}
                                className="bg-[#EA580C] hover:bg-[#c2410c] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus size={20} />
                                Add Slider
                            </button>
                        </div>
                    </div>

                    {/* Sliders Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Preview</th>
                                    <th className="px-6 py-4">Title / Link</th>
                                    <th className="px-6 py-4 text-center">Order</th>
                                    <th className="px-6 py-4 text-center">Location</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedSliders.length > 0 ? (
                                    sortedSliders.map((slider) => (
                                        <tr key={slider.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-32 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                                                    {slider.image ? (
                                                        <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{slider.title}</div>
                                                    <div className="text-xs text-gray-500">{slider.subtitle}</div>
                                                    {slider.buttonLink && <div className="text-xs text-blue-500 mt-1">{slider.buttonLink}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="font-mono font-medium text-gray-700">{slider.order}</span>
                                                    <div className="flex flex-col">
                                                        <button onClick={() => moveSlider(slider, 'up')} className="text-gray-400 hover:text-gray-600"><ChevronUp size={12} /></button>
                                                        <button onClick={() => moveSlider(slider, 'down')} className="text-gray-400 hover:text-gray-600"><ChevronDown size={12} /></button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-700">
                                                    {slider.location}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleActive(slider)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border cursor-pointer ${slider.active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                                                        }`}
                                                >
                                                    {slider.active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                    {slider.active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(slider)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slider)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                                            <div className="flex flex-col items-center gap-2">
                                                <ImageIcon size={40} className="text-gray-300" />
                                                <span className="font-medium">No sliders found</span>
                                                <p className="text-sm">Create a new slider to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingSlider ? 'Edit Slider' : 'Add New Slider'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Location</label>
                                <select
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="home">Home Page</option>
                                    <option value="courses">Courses Page</option>
                                    <option value="shop">Shop Page</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter slider title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Enter slider subtitle"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image *</label>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <ImageUploader
                                        label=""
                                        value={formData.image ? [formData.image] : []}
                                        onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={formData.buttonText}
                                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="Learn More"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                                    <input
                                        type="text"
                                        value={formData.buttonLink}
                                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="/courses"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Active Status</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    {editingSlider ? 'Update Slider' : 'Add Slider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sliders;
