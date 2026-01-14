import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, CheckCircle, XCircle, Link as LinkIcon, Edit2, Trash2, Eye, EyeOff, LayoutGrid, List as ListIcon, Loader } from 'lucide-react';
import DataTable from '../../../components/admin/shared/DataTable';
import FormModal from '../../../components/admin/shared/FormModal';
import ToggleSwitch from '../../../components/admin/shared/ToggleSwitch';
import StatCard from '../../../components/admin/shared/StatCard';
import { bannerService, mediaService } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [uploading, setUploading] = useState(false);

    // START: Form State - Added title as it is required by backend
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        isActive: true,
        placement: 'home',
        linkUrl: ''
    });

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getBanners();
            const data = response.data?.data || response.data || [];
            setBanners(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const activeBanners = banners.filter(b => b.isActive).length;
    const totalBanners = banners.length;

    const handleOpenAdd = () => {
        setEditingBanner(null);
        setFormData({
            title: '',
            imageUrl: '',
            isActive: true,
            placement: 'home',
            linkUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            imageUrl: banner.imageUrl || banner.image || '',
            isActive: banner.isActive !== undefined ? banner.isActive : (banner.status === 'Active'),
            placement: banner.placement || banner.page || 'home',
            linkUrl: banner.linkUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (banner) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await bannerService.deleteBanner(banner.id);
                    Swal.fire("Deleted!", "Banner has been deleted.", "success");
                    fetchBanners();
                } catch (error) {
                    console.error('Error deleting banner:', error);
                    toast.error('Failed to delete banner');
                }
            }
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await mediaService.uploadFile(file, 'banners');
            const url = response.url || response.data?.url || response.secure_url;
            setFormData(prev => ({ ...prev, imageUrl: url }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.imageUrl) {
            toast.error("Title and Image are required");
            return;
        }

        try {
            if (editingBanner) {
                await bannerService.updateBanner(editingBanner.id, formData);
                toast.success("Banner updated successfully");
            } else {
                await bannerService.createBanner(formData);
                toast.success("Banner created successfully");
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error(error.response?.data?.error || 'Failed to save banner');
        }
    };

    const columns = [
        {
            header: 'Image',
            accessor: 'imageUrl',
            render: (item) => (
                <div className="w-32 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={item.imageUrl || item.image} alt="Banner" className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: 'Title',
            accessor: 'title',
            render: (item) => <span className="font-medium text-gray-800">{item.title}</span>
        },
        {
            header: 'Position',
            accessor: 'placement',
            render: (item) => {
                const p = item.placement || item.page || 'home';
                return (
                    <span className="text-sm text-gray-700 capitalize font-medium">
                        {p === 'home' ? 'Home Page' :
                            p === 'home-top' ? 'Home Top' :
                                `${p.charAt(0).toUpperCase() + p.slice(1)}`}
                    </span>
                );
            }
        },
        {
            header: 'Link URL',
            accessor: 'linkUrl',
            render: (item) => (
                item.linkUrl ? (
                    <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm truncate max-w-[200px] block">
                        {item.linkUrl}
                    </a>
                ) : (
                    <span className="text-gray-400 text-sm">No link</span>
                )
            )
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (item) => {
                const isActive = item.isActive !== undefined ? item.isActive : (item.status === 'Active');
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Banner & Ad Management</h1>
            </div>

            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Advertisements" value={totalBanners} icon={ImageIcon} color="indigo" />
                <StatCard title="Active Ads" value={activeBanners} icon={CheckCircle} color="green" />
                <StatCard
                    title="Pages Covered"
                    value={new Set(banners?.map(b => b.placement || b.page)).size || 0}
                    icon={LinkIcon}
                    color="blue"
                />
                <div className="flex flex-col justify-center gap-3">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0c2d50] text-white rounded-xl hover:bg-[#0a2644] transition-colors shadow-lg font-medium"
                    >
                        <Plus size={20} />
                        Create Banner
                    </button>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-[#0c2d50] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid size={18} /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-50 text-[#0c2d50] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ListIcon size={18} /> List
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center p-12"><Loader className="animate-spin text-[#0c2d50]" /></div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map(banner => {
                        const isActive = banner.isActive !== undefined ? banner.isActive : (banner.status === 'Active');
                        const placement = banner.placement || banner.page || 'home';
                        const imageUrl = banner.imageUrl || banner.image;
                        return (
                            <div key={banner.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                {/* Banner Preview */}
                                <div className="relative h-48 bg-gray-100 overflow-hidden border-b border-gray-100">
                                    <img
                                        src={imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${isActive ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'
                                            }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                                        <p className="text-xs font-medium uppercase tracking-wider opacity-90">
                                            {placement}
                                        </p>
                                        <p className="font-bold truncate">{banner.title}</p>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenEdit(banner)}
                                            className="p-2.5 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner)}
                                            className="p-2.5 bg-white text-red-600 rounded-full hover:scale-110 transition-transform shadow-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        {banner.linkUrl ? (
                                            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline mb-2 font-medium">
                                                <LinkIcon size={14} />
                                                {banner.linkUrl}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-400 mb-2 flex items-center gap-1.5">
                                                <LinkIcon size={14} /> No link
                                            </p>
                                        )}
                                    </div>
                                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                                        <span>Added: {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'N/A'}</span>
                                        <div className="flex items-center gap-1">
                                            {isActive ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} />}
                                            {isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {banners.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No banners found.</div>}
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={banners}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    itemsPerPage={10}
                />
            )}

            {/* Add/Edit Modal */}
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBanner ? 'Edit Advertisement' : 'Create Advertisement'}
                onSubmit={handleSubmit}
                size="md"
            >
                <div className="space-y-6">
                    {/* Title Field (REQUIRED) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Banner Title (Required)"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-4">
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} className="w-20 h-10 object-cover rounded border" alt="Preview" />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                                {uploading ? "Uploading..." : "Choose File"}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                            {formData.imageUrl && <span className="text-xs text-green-600">Image Selected</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Recommended Size (1375 x 409px)</p>
                    </div>

                    {/* Enter URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter URL:</label>
                        <input
                            type="url"
                            value={formData.linkUrl}
                            onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter URL"
                        />
                    </div>

                    {/* Position Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position:</label>
                        <select
                            value={formData.placement}
                            onChange={e => setFormData({ ...formData, placement: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        >
                            <option value="home">Home Page - Below Slider</option>
                            <option value="home-top">Home Page - Top Banner</option>
                            <option value="courses">Courses Listing Page</option>
                            <option value="exams">Exams Listing Page</option>
                            <option value="quizzes">Quiz Listing Page</option>
                            <option value="music">Music Listing Page</option>
                            <option value="podcasts">Podcast Listing Page</option>
                            <option value="meditation">Meditation Listing Page</option>
                            <option value="knowledgebase">Knowledgebase Page</option>
                            <option value="shop">Shop/E-commerce Page</option>
                            <option value="gaushala">Gaushala Listing Page</option>
                        </select>
                    </div>

                    {/* Status Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
                        <ToggleSwitch
                            checked={formData.isActive}
                            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    imageUrl: '',
                                    isActive: true,
                                    placement: 'home',
                                    linkUrl: ''
                                });
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                        >
                            <XCircle size={18} />
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2644] transition-colors font-medium shadow-sm disabled:opacity-50"
                            disabled={uploading}
                        >
                            <CheckCircle size={18} />
                            {editingBanner ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </FormModal>
        </div>
    );
};

export default Banners;
