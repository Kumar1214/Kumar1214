import { useState, useRef } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import JoditEditor from "jodit-react";

export default function Blogs() {
  const [search, setSearch] = useState("");

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "How to Improve Productivity",
      author: "John Doe",
      category: "Lifestyle",
      thumbnail: "",
      content: "Sample content...",
      status: "Active",
      date: "2025-01-10",
    },
    {
      id: 2,
      title: "Latest Tech Trends",
      author: "Sarah Smith",
      category: "Technology",
      thumbnail: "",
      content: "Tech blog content...",
      status: "Inactive",
      date: "2025-01-05",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const editor = useRef(null);

  const openAddModal = () => {
    setEditData({
      title: "",
      author: "",
      category: "",
      content: "",
      thumbnail: "",
      status: "Active",
      date: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const saveBlog = () => {
    if (editData.id) {
      setBlogs(blogs.map((b) => (b.id === editData.id ? editData : b)));
    } else {
      setBlogs([...blogs, { ...editData, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="bg-white md:p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Blogs</h2>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#0c2d50] text-white rounded flex gap-2 items-center"
        >
          <FiPlus /> Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">#</th>
            <th className="p-3">Thumbnail</th>
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Category</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {blogs
            .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
            .map((blog, i) => (
              <tr key={blog.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-3">{i + 1}</td>

                <td className="p-3">
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt="thumb"
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded" />
                  )}
                </td>

                <td className="p-3 font-medium">{blog.title}</td>
                <td className="p-3">{blog.author}</td>
                <td className="p-3">{blog.category}</td>
                <td className="p-3">{blog.date}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      blog.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditData(blog);
                      setModalOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => setDeleteId(blog.id)}
                    className="text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ========== MODAL ========== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editData?.id ? "Edit Blog" : "Add Blog"}
            </h3>

            {/* Title */}
            <input
              type="text"
              placeholder="Title"
              className="border w-full mb-3 px-3 py-2 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />

            <select
              className="border w-full mb-3 px-3 py-2 rounded"
              value={editData.author}
              onChange={(e) =>
                setEditData({ ...editData, author: e.target.value })
              }
            >
              <option value="">Select Author</option>
              <option value="John Doe">John Doe</option>
              <option value="Sarah Smith">Sarah Smith</option>
              <option value="Michael Johnson">Michael Johnson</option>
              <option value="Emily Carter">Emily Carter</option>
            </select>

            {/* Category */}
            <select
              className="border w-full mb-3 px-3 py-2 rounded"
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
            </select>

            {/* Content - Jodit Editor */}
            <label className="block mb-2 text-sm font-medium">Content</label>
            <JoditEditor
              ref={editor}
              value={editData.content}
              tabIndex={1}
              onBlur={(newContent) =>
                setEditData({ ...editData, content: newContent })
              }
            />

            <div className="h-3"></div>

            {/* Thumbnail */}
            <label className="block text-sm font-medium">Thumbnail</label>
            <p className="text-xs text-gray-500 mb-2">
              Supported size:{" "}
              <span className="font-semibold">600 × 400 px</span> (or similar
              ratio)
            </p>
            <input
              type="file"
              accept="image/*"
              className="mb-3"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  thumbnail: URL.createObjectURL(e.target.files[0]),
                })
              }
            />

            {editData.thumbnail && (
              <img
                src={editData.thumbnail}
                className="w-24 h-24 rounded object-cover mb-4 border"
                alt="preview"
              />
            )}

            {/* Status */}
            <select
              className="border w-full mb-4 px-3 py-2 rounded"
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveBlog}
                className="px-4 py-2 bg-[#0c2d50] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRMATION ========== */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-72 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Delete Blog?</h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBlogs(blogs.filter((b) => b.id !== deleteId));
                  setDeleteId(null);
                }}
                className="px-4 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
