import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function SubCategories() {
  const [search, setSearch] = useState("");

  const [subCategories, setSubCategories] = useState([
    { id: 1, name: "Mobiles", parent: "Electronics", icon: "📱" },
    { id: 2, name: "Men Clothing", parent: "Fashion", icon: "👕" },
    { id: 3, name: "Vegetables", parent: "Groceries", icon: "🥦" },
  ]);

  // Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const saveSubCategory = () => {
    if (editData.id) {
      setSubCategories(
        subCategories.map((c) => (c.id === editData.id ? editData : c))
      );
    } else {
      setSubCategories([...subCategories, { ...editData, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Sub Categories</h2>

        <button
          onClick={() => {
            setEditData({ name: "", icon: "", parent: "" });
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#0c2d50] text-white rounded flex gap-2 items-center"
        >
          <FiPlus /> Add Sub Category
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">#</th>
            <th className="p-3 w-20">Icon</th>
            <th className="p-3">Sub Category</th>
            <th className="p-3">Parent Category</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {subCategories
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((cat, i) => (
              <tr key={cat.id} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-3">{i + 1}</td>

                <td className="p-3 text-xl">{cat.icon}</td>

                <td className="p-3 font-medium">{cat.name}</td>

                <td className="p-3 text-gray-600">{cat.parent}</td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditData(cat);
                      setModalOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    <FiEdit />
                  </button>

                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-4">
              {editData.id ? "Edit Sub Category" : "Add Sub Category"}
            </h3>

            <input
              type="text"
              placeholder="Icon (emoji)"
              className="border w-full mb-3 px-3 py-1 rounded"
              value={editData.icon}
              onChange={(e) =>
                setEditData({ ...editData, icon: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Sub Category Name"
              className="border w-full mb-3 px-3 py-1 rounded"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Parent Category"
              className="border w-full mb-3 px-3 py-1 rounded"
              value={editData.parent}
              onChange={(e) =>
                setEditData({ ...editData, parent: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveSubCategory}
                className="px-4 py-1 bg-[#0c2d50] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-72">
            <h3 className="text-lg font-semibold mb-4">Delete Sub Category?</h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSubCategories(
                    subCategories.filter((c) => c.id !== deleteId)
                  );
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
