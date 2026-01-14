import React, { useState } from 'react';
import { Plus, Image as ImageIcon, CheckCircle, XCircle, Link as LinkIcon, Edit2, Trash2, Eye, EyeOff, LayoutGrid, List as ListIcon } from 'lucide-react';
import DataTable from './shared/DataTable';
import FormModal from './shared/FormModal';
import FileUploader from './shared/FileUploader';
import ToggleSwitch from './shared/ToggleSwitch';
import StatCard from './shared/StatCard';
import bannersData from '../../data/banners.json';

const BannerManagement = () => {
    const [banners, setBanners] = useState(bannersData.map(b => ({
        ...b,
        page: b.page || 'home',
        linkUrl: b.linkUrl || '',
    })));
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        image: '',
        status: 'Active',
        page: 'home',
        linkUrl: ''
    });

    const activeBanners = banners.filter(b => b.status === 'Active').length;
    const totalBanners = banners.length;

    const handleOpenAdd = () => {
        setEditingBanner(null);
        setFormData({
            image: '',
            status: 'Active',
            page: 'home',
            linkUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            image: banner.image,
            status: banner.status,
            page: banner.page || 'home',
            linkUrl: banner.linkUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (banner) => {
        if (window.confirm('Are you sure you want to delete this advertisement?')) {
            setBanners(banners.filter(b => b.id !== banner.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBanner) {
            setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
        } else {
            setBanners([...banners, { id: Date.now().toString(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            header: 'Image',
            accessor: 'image',
            render: (item) => (
                <div className="w-32 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={item.image} alt="Banner" className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: 'Position',
            accessor: 'page',
            render: (item) => (
                <span className="text-sm text-gray-700 capitalize font-medium">
                    {item.page === 'home' ? 'Home Page' :
                        item.page === 'home-top' ? 'Home Top' :
                            `${item.page.charAt(0).toUpperCase() + item.page.slice(1)}`}
                </span>
            )
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
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Advertisements" value={totalBanners} icon={ImageIcon} color="indigo" />
                <StatCard title="Active Ads" value={activeBanners} icon={CheckCircle} color="green" />
                <StatCard
                    title="Pages Covered"
                    value={new Set(banners.map(b => b.page)).size}
                    icon={LinkIcon}
                    color="blue"
                />
                <div className="flex flex-col justify-center gap-3">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium"
                    >
                        <Plus size={20} />
                        Create Advertisement
                    </button>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid size={18} /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ListIcon size={18} /> List
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map(banner => (
                        <div key={banner.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                            {/* Banner Preview */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden border-b border-gray-100">
                                <img
                                    src={banner.image}
                                    alt="Banner"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${banner.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'
                                        }`}>
                                        {banner.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                                    <p className="text-xs font-medium uppercase tracking-wider opacity-90">
                                        {banner.page === 'home' ? 'Home Page' : banner.page}
                                    </p>
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
                                    <span>Added: {new Date(parseInt(banner.id)).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1">
                                        {banner.status === 'Active' ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} />}
                                        {banner.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image:</label>
                        <FileUploader
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
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
                            value={formData.page}
                            onChange={e => setFormData({ ...formData, page: e.target.value })}
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
                            checked={formData.status === 'Active'}
                            onChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Inactive' })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    image: '',
                                    status: 'Active',
                                    page: 'home',
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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
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

export default BannerManagement;
