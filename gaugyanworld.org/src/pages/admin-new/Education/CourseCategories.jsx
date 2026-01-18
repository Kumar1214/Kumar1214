import { useState, useRef, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiSmile, FiX } from "react-icons/fi";

const EMOJI_LIST = [
  "📈", "📉", "📊", "💹", "💰", "💵", "🏦", "🏧",
  "🎓", "🏫", "🎒", "📚", "🖊️", "📝", "🧠", "💡",
  "💻", "🖥️", "📱", "⌚", "🖱️", "⌨️", "🧘", "🕉️",
  "🏥", "💊", "🧬", "🔬", "🌍", "🌱", "🎵", "🎨"
];

import { toast } from "react-hot-toast";
import { contentService, mediaService } from "../../../services/api";

export default function AllCategories() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await contentService.getCourseCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [newCategory, setNewCategory] = useState({
    icon: "",
    name: "",
    image: "",
  });

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name) return toast.error("Name is required");

    try {
      await contentService.createCourseCategory(newCategory);
      toast.success("Category added successfully");
      fetchCategories();
      setNewCategory({ icon: "", name: "", image: "" });
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const loadingToast = toast.loading("Uploading image...");
      try {
        const response = await mediaService.uploadFile(file, "categories");
        const imageUrl = response.url; // Assuming uploadFile returns { url: ... }

        if (isEdit) {
          setEditCategory({ ...editCategory, image: imageUrl });
        } else {
          setNewCategory({ ...newCategory, image: imageUrl });
        }
        toast.dismiss(loadingToast);
        toast.success("Image uploaded");
      } catch (error) {
        toast.dismiss(loadingToast);
        // Fallback for demo if backend upload fails or mocked
        const url = URL.createObjectURL(file);
        if (isEdit) setEditCategory({ ...editCategory, image: url });
        else setNewCategory({ ...newCategory, image: url });
        toast.error("Upload failed, using local preview");
      }
    }
  };

  // Edit Category
  const handleSaveEdit = async () => {
    try {
      await contentService.updateCourseCategory(editCategory.id, editCategory);
      toast.success("Category updated");
      fetchCategories();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await contentService.deleteCourseCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">All Categories</h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0c2d50] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Icon</th>
              <th className="p-3">Image</th>
              <th className="p-3">Category Name</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((cat, index) => (
                <tr
                  key={cat.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-2xl">{cat.icon}</td>
                  <td className="p-3">
                    <img
                      src={cat.image}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="p-3 font-medium">{cat.name}</td>

                  {/* ACTION BUTTONS */}
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => {
                        setEditCategory(cat);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing {categories.length} of {categories.length} entries
        </p>
      </div>

      {/* ------------------------- ADD CATEGORY MODAL ------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>

            <div className="space-y-3">
              {/* Icon Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded-lg bg-gray-50">
                    {newCategory.icon || "❓"}
                  </div>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex-1 border rounded-lg px-3 flex items-center gap-2 hover:bg-gray-50"
                  >
                    <FiSmile /> {newCategory.icon ? "Change Icon" : "Select Icon"}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded-xl shadow-xl w-64 z-10 grid grid-cols-6 gap-1 h-48 overflow-y-auto">
                    {EMOJI_LIST.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewCategory({ ...newCategory, icon: emoji });
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="col-span-6 text-xs text-center p-1 text-red-500 hover:bg-red-50 rounded mt-1"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Category Name"
                className="border p-2 rounded w-full"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm"
                  >
                    <FiUpload /> Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                  <input
                    type="text"
                    placeholder="Or enter Image URL"
                    className="border p-2 rounded flex-1 text-sm"
                    value={newCategory.image}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, image: e.target.value })
                    }
                  />
                </div>
                {newCategory.image && (
                  <img src={newCategory.image} className="w-full h-32 object-cover rounded-lg border" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#0c2d50] text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------- EDIT CATEGORY MODAL ------------------------- */}
      {showEditModal && editCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>

            <div className="space-y-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex gap-2">
                  <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded-lg bg-gray-50">
                    {editCategory.icon || "❓"}
                  </div>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex-1 border rounded-lg px-3 flex items-center gap-2 hover:bg-gray-50"
                  >
                    <FiSmile /> Change Icon
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded-xl shadow-xl w-64 z-10 grid grid-cols-6 gap-1 h-48 overflow-y-auto">
                    {EMOJI_LIST.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setEditCategory({ ...editCategory, icon: emoji });
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="col-span-6 text-xs text-center p-1 text-red-500 hover:bg-red-50 rounded mt-1"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                className="border p-2 rounded w-full"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => document.getElementById('edit-file-upload').click()}
                    className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm"
                  >
                    <FiUpload /> Upload
                  </button>
                  <input
                    id="edit-file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                  <input
                    type="text"
                    className="border p-2 rounded flex-1 text-sm"
                    value={editCategory.image}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, image: e.target.value })
                    }
                  />
                </div>
                {editCategory.image && (
                  <img src={editCategory.image} className="w-full h-32 object-cover rounded-lg border" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#0c2d50] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
