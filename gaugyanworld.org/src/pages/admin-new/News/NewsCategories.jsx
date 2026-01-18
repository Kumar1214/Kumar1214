import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { contentService } from "../../../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function NewsCategories() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await contentService.getNewsCategories();
      // Ensure we handle the response structure safely
      const data = response.data?.data || response.data || [];
      setCategories(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
     
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const saveCategory = async () => {
    if (!editData.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editData.id) {
        await contentService.updateNewsCategory(editData.id, { name: editData.name });
        toast.success("Category updated successfully");
      } else {
        await contentService.createNewsCategory({ name: editData.name });
        toast.success("Category added successfully");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
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
          await contentService.deleteNewsCategory(id);
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          fetchCategories();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Failed to delete category.", "error");
        }
      }
    });
  };

  return (
    <div className="bg-white md:p-6 rounded-xl shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">News Categories</h2>

        <button
          onClick={() => {
            setEditData({ name: "" });
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#0c2d50] text-white rounded flex gap-2 items-center hover:bg-[#0a2644] transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded outline-none focus:ring-1 focus:ring-[#0c2d50]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Category Name</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories
                  .filter((c) =>
                    c.name?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((cat, i) => (
                    <tr key={cat.id || i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{cat.name}</td>

                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => {
                            setEditData(cat);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => confirmDelete(cat.id)}
                          className="text-red-600 hover:text-red-800"
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
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editData.id ? "Edit Category" : "Add Category"}
            </h3>

            <input
              type="text"
              placeholder="Category Name"
              className="border w-full mb-3 px-3 py-2 rounded outline-none focus:ring-1 focus:ring-[#0c2d50]"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                className="px-4 py-2 bg-[#0c2d50] text-white rounded hover:bg-[#0a2644] transition-colors"
                disabled={loading}
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
