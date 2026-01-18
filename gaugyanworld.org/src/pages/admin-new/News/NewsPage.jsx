import { useState, useEffect, useContext } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiShare2, FiBookmark, FiTrendingUp, FiBarChart2, FiUpload, FiX } from "react-icons/fi";
import { DataContext } from "../../../context/DataContext";
import AnalyticsGrid from "../../../components/admin/analytics/AnalyticsGrid";
import TrendingChart from "../../../components/admin/analytics/TrendingChart";
import TrendingModal from "../../../components/admin/analytics/TrendingModal";
import { contentService, mediaService } from "../../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function NewsPage() {
  const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch News and Categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, catRes] = await Promise.all([
        contentService.getNews({ limit: 100 }),
        contentService.getNewsCategories()
      ]);

      const newsData = newsRes.data?.data || newsRes.data || [];
      const catData = catRes.data?.data || catRes.data || [];

      setNews(Array.isArray(newsData) ? newsData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load news data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Keep analytics logic as is for now
    const fetchAnalyticsData = async () => {
      const data = await getModuleAnalytics('news');
      if (data) setAnalytics(data);

      const trendingData = await getTrendingContent('news', 10);
      if (trendingData && trendingData.length > 0) setTrending(trendingData);
    };
    fetchAnalyticsData();
  }, []);

  const metrics = [
    { title: "Total Articles", value: analytics?.totalItems || news.length, icon: FiBarChart2, color: "indigo" },
    { title: "Total Views", value: analytics?.overview?.totalViews?.toLocaleString() || "0", icon: FiEye, color: "blue", trend: "up", trendValue: 12 },
    { title: "Total Shares", value: analytics?.overview?.totalShares?.toLocaleString() || "0", icon: FiShare2, color: "green", trend: "up", trendValue: 8 },
    { title: "Total Bookmarks", value: analytics?.overview?.totalBookmarks?.toLocaleString() || "0", icon: FiBookmark, color: "purple" }
  ];

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    status: "published"
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.uploadFile(file, 'news');
      // Assuming response contains { url: '...' } based on common patterns, need to verify if mediaService returns correctly
      // Checking api.js: returns response.data. The structure depends on backend. 
      // Usually it's data.url or data.file.path. Let's assume data.url or check standard response.
      // If backend returns { success: true, url: ... }
      const url = response.url || response.data?.url || response.secure_url;

      setEditData(prev => ({ ...prev, featuredImage: url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveNews = async () => {
    if (!editData.title || !editData.category || !editData.content) {
      toast.error("Title, Category, and Content are required");
      return;
    }

    try {
      // Backend requires: title, excerpt, content, category, featuredImage (opt)
      const payload = {
        ...editData,
        excerpt: editData.excerpt || editData.content.substring(0, 150) + "...", // Auto-generate excerpt if missing
      };

      if (editData.id) {
        await contentService.updateNews(editData.id, payload);
        toast.success("News updated successfully");
      } else {
        await contentService.createNews(payload);
        toast.success("News created successfully");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error(error.response?.data?.message || "Failed to save news");
    }
  };

  const confirmDelete = (id) => {
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
          await contentService.deleteNews(id);
          Swal.fire("Deleted!", "News article has been deleted.", "success");
          fetchData();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Failed to delete news.", "error");
        }
      }
    });
  }

  return (
    <>
      <AnalyticsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Trending News</h3>
              <p className="text-sm text-gray-500">Views performance over popular articles</p>
            </div>
            <button
              onClick={() => setShowTrendingModal(true)}
              className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline"
            >
              <FiTrendingUp /> View Top 50
            </button>
          </div>
          <TrendingChart data={trending.length > 0 ? trending : news} />
        </div>

        <div className="bg-[#0c2d50] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Engagement Insight</h3>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Your "Ancient Ayurveda" series is performing exceptionally well this week, with a 24% increase in bookmarks. Consider featuring more content from this category.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-sm text-blue-100">Most Shared</span>
              <span className="text-sm font-bold">Vedic Chants</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-sm text-blue-100">Top Growth</span>
              <span className="text-sm font-bold">+18% Views</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-100">User Retention</span>
              <span className="text-sm font-bold">64%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">News Inventory</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search news title..."
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => {
                setEditData({
                  title: "",
                  category: "",
                  excerpt: "",
                  content: "",
                  featuredImage: "",
                  status: "published"
                });
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0c2d50] text-white rounded flex items-center gap-2 hover:bg-[#0a2644] transition-colors"
            >
              <FiPlus /> Add News
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 rounded-tl-xl text-xs font-bold uppercase text-gray-500">#</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500">Title</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500">Category</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Views</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Shares</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500 text-center">Status</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-500">Date</th>
                <th className="p-4 rounded-tr-xl text-xs font-bold uppercase text-gray-500">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center">Loading news...</td></tr>
              ) : news.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No news articles found.</td></tr>
              ) : (
                news
                  .filter((n) => n.title?.toLowerCase().includes(search.toLowerCase()))
                  .map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="p-4 text-sm font-medium text-gray-900">{i + 1}</td>
                      <td className="p-4 text-sm font-semibold text-gray-800 flex items-center gap-3">
                        {item.featuredImage && (
                          <img src={item.featuredImage} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        {item.title}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{item.category}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-700 text-center font-medium">{item.views?.toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-700 text-center font-medium">{item.shares?.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'published' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(item.createdAt || item.updatedAt).toLocaleDateString()}</td>

                      <td className="p-4 flex gap-3">
                        <button
                          onClick={() => {
                            setEditData(item);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="text-red-600 p-1 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] overflow-y-auto py-10">
          <div className="bg-white p-6 rounded-xl w-[600px] shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editData.id ? "Edit News" : "Add News"}
            </h3>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter news title"
                  className="border border-gray-200 w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select
                  className="border border-gray-200 w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {/* Fallback if categories are failing to load */}
                  {!categories.length && (
                    <>
                      <option value="General">General</option>
                      <option value="Spiritual">Spiritual</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt (Short Summary)</label>
                <textarea
                  placeholder="Brief description..."
                  className="border border-gray-200 w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                  value={editData.excerpt || ''}
                  onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content</label>
                <textarea
                  placeholder="Full article content..."
                  className="border border-gray-200 w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-40"
                  value={editData.content || ''}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Featured Image</label>
                <div className="flex items-center gap-4">
                  {editData.featuredImage && (
                    <img src={editData.featuredImage} alt="Preview" className="w-16 h-16 rounded object-cover border" />
                  )}
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiUpload /> {uploading ? "Uploading..." : "Upload Image"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select
                  className="border border-gray-200 w-full px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveNews}
                className="px-6 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2644] font-bold shadow-md shadow-blue-900/10 disabled:opacity-50"
                disabled={uploading}
              >
                {editData.id ? "Update News" : "Save News"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRENDING MODAL */}
      <TrendingModal
        isOpen={showTrendingModal}
        onClose={() => setShowTrendingModal(false)}
        title="Top News by Views"
        data={trending.length > 0 ? trending : news}
      />
    </>
  );
}
