import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2, FiPlus, FiPlay, FiX, FiInfo, FiTrendingUp, FiEye, FiShare2, FiBookmark, FiMic, FiList, FiGrid, FiSearch, FiCheck, FiMusic, FiYoutube, FiHeadphones } from "react-icons/fi";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";
import { useData } from "../../../context/useData";
import { DataContext } from "../../../context/DataContext";
import AnalyticsGrid from "../../../components/admin/analytics/AnalyticsGrid";
import TrendingModal from "../../../components/admin/analytics/TrendingModal";
import FileUploader from "../../../components/admin/shared/FileUploader";

export default function Podcasts() {
  const { podcasts, addPodcast, deletePodcast, updatePodcast } = useData();
  const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [showTrendingModal, setShowTrendingModal] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getModuleAnalytics('podcast');
        if (data) setAnalytics(data);
        const trendingData = await getTrendingContent('podcast', 10);
        if (trendingData) setTrending(trendingData);
      } catch (err) {
        console.error("Error fetching podcast analytics:", err);
      }
    };
    fetchAnalytics();
  }, [getModuleAnalytics, getTrendingContent]);

  const openAddModal = () => {
    setEditData({
      title: "",
      host: "",
      category: "",
      series: "Standalone",
      duration: "",
      description: "",
      coverArt: "",
      audioUrl: "",
      youtubeUrl: "",
      status: "published",
    });
    setModalOpen(true);
  };

  const handleEdit = (podcast) => {
    setEditData({ ...podcast });
    setModalOpen(true);
  };

  const savePodcast = async () => {
    if (!editData.title || !editData.host || !editData.category || !editData.audioUrl || !editData.series || !editData.description || !editData.duration) {
      toast.error("Please fill all required fields (Title, Host, Category, Series, Duration, Description, Audio URL)!");
      return;
    }

    try {
      const { id, createdAt, updatedAt, uploader, ...cleanData } = editData;

      let promise;
      if (editData.id) {
        promise = updatePodcast(editData.id, cleanData);
      } else {
        promise = addPodcast(cleanData);
      }

      await toast.promise(promise, {
        loading: editData.id ? 'Updating podcast...' : 'Adding podcast...',
        success: editData.id ? 'Podcast updated successfully!' : 'Podcast added successfully!',
        error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Error saving podcast:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deletePodcast(id);
        toast.success('Podcast deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting podcast:', error);
      toast.error('Failed to delete podcast');
    }
  };

  const filteredPodcasts = podcasts?.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.host.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiMic className="text-orange-500" /> Podcast Library
          </h2>
          <p className="text-gray-500">Manage episodes, series, and audio content</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
        >
          <FiPlus size={20} />
          Add Episode
        </button>
      </div>

      {/* Analytics */}
      <AnalyticsGrid
        metrics={[
          { title: 'Total Episodes', value: analytics?.totalItems || podcasts?.length || 0, icon: FiMic, color: 'orange' },
          { title: 'Total Listens', value: analytics?.overview?.totalViews?.toLocaleString() || '1,240', icon: FiHeadphones, color: 'blue', trend: 'up', trendValue: 12 },
          { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '450', icon: FiShare2, color: 'green', trend: 'up', trendValue: 5 },
          { title: 'Avg Duration', value: '42m', icon: FiInfo, color: 'purple' }
        ]}
      />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-500'}`}><FiGrid /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-500'}`}><FiList /></button>
        </div>
      </div>

      {/* Content Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPodcasts.map(item => (
            <div key={item.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square bg-gray-100">
                <img src={item.coverArt || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-white rounded-full text-gray-800 hover:text-orange-600"><FiEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-gray-800 hover:text-red-600"><FiTrash2 /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.host}</p>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{item.duration}</span>
                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Episode</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Host</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPodcasts.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={item.coverArt} className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.duration}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{item.host}</td>
                  <td className="p-4 text-sm text-gray-600">{item.category}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-orange-600"><FiEdit /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      {modalOpen && editData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1a1a1a] z-10">
              <h3 className="text-xl font-bold text-white">{editData.id ? 'Edit Podcast' : 'New Podcast'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input type="text" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" placeholder="Episode Title" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Host *</label>
                  <input type="text" value={editData.host} onChange={e => setEditData({ ...editData, host: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" placeholder="Host Name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Series *</label>
                  <input type="text" value={editData.series} onChange={e => setEditData({ ...editData, series: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" placeholder="Series Name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category *</label>
                  <select value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500">
                    <option value="">Select Category</option>
                    <option value="Spirituality">Spirituality</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Education">Education</option>
                    <option value="Stories">Stories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration *</label>
                  <input type="text" value={editData.duration} onChange={e => setEditData({ ...editData, duration: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" placeholder="e.g. 45 min" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Media */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Audio Source (MP3/URL) *</label>
                <div className="flex gap-2">
                  <input type="text" value={editData.audioUrl} onChange={e => setEditData({ ...editData, audioUrl: e.target.value })} className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" placeholder="https://..." />
                  <FileUploader onUploadComplete={(url) => setEditData({ ...editData, audioUrl: url })} type="audio" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Cover Art</label>
                <FileUploader value={editData.coverArt} onChange={(url) => setEditData({ ...editData, coverArt: url })} />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} rows={4} className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-2 text-white outline-none focus:border-orange-500" />
              </div>

            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded text-gray-300 hover:text-white">Cancel</button>
              <button onClick={savePodcast} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Save Podcast</button>
            </div>
          </div>
        </div>
      )}

      <TrendingModal
        isOpen={showTrendingModal}
        onClose={() => setShowTrendingModal(false)}
        title="Top Performing Podcasts"
        data={trending.length > 0 ? trending : podcasts}
      />
    </div>
  );
}
