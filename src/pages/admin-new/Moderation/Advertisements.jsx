import React, { useState, useEffect } from 'react';
import { Layout, Plus, Edit, Trash2, ExternalLink, Image as ImageIcon, CheckCircle, XCircle, Search, Eye, MousePointer } from 'lucide-react';
import { bannerService, mediaService } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Advertisements = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    // Mapping UI locations to Backend 'placement' enum
    const locationMap = {
        'Homepage Top': 'home-top',
        'Sidebar': 'sidebar',
        'Course Detail': 'course-detail',
        'Checkout Page': 'checkout',
        'Footer': 'footer'
    };

    // Reverse map for display
    const displayLocationMap = Object.fromEntries(Object.entries(locationMap).map(([k, v]) => [v, k]));

    const [formData, setFormData] = useState({
        title: '',
        location: 'sidebar', // Default backend value
        image: '',
        link: '',
        status: 'active',
        startDate: '',
        endDate: ''
    });

    const locations = ['Homepage Top', 'Sidebar', 'Course Detail', 'Checkout Page', 'Footer'];

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getBanners();
            const allBanners = response.data?.data || response.data || [];
            // Filter only ads relevant to this page (using the specific placements)
            const adPlacements = Object.values(locationMap);
            // If backend returns all banners, we might want to show only 'Ad' related ones, or all. 
            // For now, let's show items that match our ad placements, plus maybe generic ones if user desires.
            // But to avoid confusion with 'Banners' page, strictly filter? 
            // Or maybe this page is just another view? 
            // Let's filter by the placements we manage here.
            const filtered = Array.isArray(allBanners) ? allBanners.filter(b => adPlacements.includes(b.placement)) : [];
            setAds(filtered);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching ads:", error);
            toast.error("Failed to load advertisements");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const filteredAds = ads.filter(ad =>
        ad.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            title: '',
            location: 'sidebar',
            image: '',
            link: '',
            status: 'active',
            startDate: '',
            endDate: ''
        });
        setEditingAd(null);
        setShowModal(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await mediaService.uploadFile(file, 'ads');
            const url = response.url || response.data?.url || response.secure_url;
            setFormData(prev => ({ ...prev, image: url }));
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

        if (!formData.title || !formData.image) {
            toast.error("Title and Image are required");
            return;
        }

        const payload = {
            title: formData.title,
            imageUrl: formData.image,
            linkUrl: formData.link,
            placement: formData.location,
            isActive: formData.status === 'active',
            startDate: formData.startDate,
            endDate: formData.endDate
        };

        try {
            if (editingAd) {
                await bannerService.updateBanner(editingAd.id, payload);
                toast.success("Advertisement updated");
            } else {
                await bannerService.createBanner(payload);
                toast.success("Advertisement created");
            }
            setShowModal(false);
            fetchAds();
        } catch (error) {
            console.error("Error saving ad:", error);
            toast.error(error.response?.data?.error || "Operation failed");
        }
    };

    const handleEdit = (ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title,
            location: ad.placement, // Should match one of our values if filtered correctly
            image: ad.imageUrl || ad.image,
            link: ad.linkUrl,
            status: ad.isActive ? 'active' : 'inactive',
            startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
            endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
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
                    await bannerService.deleteBanner(id);
                    Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
                    setAds(ads.filter(a => a.id !== id));
                } catch (error) {
                    console.error("Delete error:", error);
                    toast.error("Failed to delete advertisement");
                }
            }
        });
    };

    const toggleStatus = async (ad) => {
        try {
            const newStatus = !ad.isActive;
            await bannerService.updateBanner(ad.id, { isActive: newStatus });
            setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: newStatus, status: newStatus ? 'active' : 'inactive' } : a));
            toast.success(`Ad ${newStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Layout className="h-8 w-8 text-orange-300" />
                        Advertisement Management
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Manage internal advertisements, banners, and promotional content spaces.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Ads</p>
                        <p className="text-3xl font-bold text-gray-900">{ads.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Active Ads</p>
                        <p className="text-3xl font-bold text-green-600">{ads.filter(a => a.isActive).length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Impressions</p>
                        {/* Dummy logic for views since backend might not send it or it's not in model. Banner.js has no views/clicks? Check model. No views/clicks in Banner.js. So just show 0 or remove. */}
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-1">Avg. CTR</p>
                        <p className="text-3xl font-bold text-purple-600">0%</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search ads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                            />
                        </div>

                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-[#EA580C] hover:bg-[#c2410c] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            Create Ad
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Preview</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4">Performance</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center">Loading ads...</td></tr>
                                ) : filteredAds.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No advertisements found.</td></tr>
                                ) : (
                                    filteredAds.map(ad => (
                                        <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4" style={{ width: '200px' }}>
                                                <div className="w-40 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative group">
                                                    {ad.imageUrl ? (
                                                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                    {ad.linkUrl && (
                                                        <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ExternalLink size={20} />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 mb-1">{ad.title}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                        {displayLocationMap[ad.placement] || ad.placement}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : 'No Start Date'} -
                                                    {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'No End Date'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-gray-600" title="Views">
                                                        <Eye size={16} className="text-blue-500" />
                                                        0
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-600" title="Clicks">
                                                        <MousePointer size={16} className="text-purple-500" />
                                                        0
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    CTR: 0%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleStatus(ad)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border cursor-pointer ${ad.isActive ? 'bg-green-50 text-green-700 border-green-100' :
                                                        'bg-gray-50 text-gray-500 border-gray-100'
                                                        }`}
                                                >
                                                    {ad.isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                    {ad.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(ad)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ad.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
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
                                {editingAd ? 'Edit Ad' : 'Create New Ad'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Spring Sale Banner"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Location</label>
                                    <select
                                        value={formData.location} // This holds the 'backend' value e.g. 'home-top'
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                    >
                                        {locations.map(loc => (
                                            <option key={loc} value={locationMap[loc]}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://example.com/promo"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Creative (Image) *</label>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    {/* Using direct file input + preview logic similar to NewsPage/Banners */}
                                    <div className="flex items-center gap-4">
                                        {formData.image && (
                                            <img src={formData.image} className="w-20 h-10 object-cover rounded border" alt="Preview" />
                                        )}
                                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                                            {uploading ? "Uploading..." : "Choose File"}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {editingAd ? 'Update Ad' : 'Create Ad'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Advertisements;
