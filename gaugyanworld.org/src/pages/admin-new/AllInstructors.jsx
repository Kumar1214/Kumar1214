import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useData } from "../../context/useData";
import { useNavigate } from "react-router-dom";

export default function AllInstructors() {
  const { users, deleteUser, refreshUsers } = useData();
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const instructors = users.filter((u) => (u.role === 'instructor' || u.type === 'instructor'));

  const deleteInstructor = async () => {
    if (instructorToDelete) {
      await deleteUser(instructorToDelete);
      setInstructorToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white md:p-6 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Instructors</h2>

        <button
          className="flex items-center gap-2 px-3 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#1e4d7b] transition-colors text-sm"
          onClick={() => navigate('/admin/users/add?role=instructor')}
        >
          <FiPlus size={14} /> Add Instructor
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
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
          placeholder="Search instructor..."
          className="border px-3 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Avatar</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {instructors
              .filter((i) =>
                (i.name || i.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
                (i.email || '').toLowerCase().includes(search.toLowerCase())
              )
              .map((ins, index) => (
                <tr
                  key={ins.id || ins.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="p-3">{index + 1}</td>

                  {/* Avatar */}
                  <td className="p-3">
                    <img
                      src={ins.profilePicture || ins.image || "https://via.placeholder.com/40"}
                      className="w-12 h-12 rounded-full object-cover border"
                      alt=""
                    />
                  </td>

                  <td className="p-3 font-medium">{ins.name || `${ins.firstName || ''} ${ins.lastName || ''}`}</td>
                  <td className="p-3">{ins.email}</td>
                  <td className="p-3 capitalize">{ins.role || ins.type}</td>

                  <td className="p-3 flex gap-3">
                    {/* Edit */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => alert("Edit functionality coming soon")}
                    >
                      <FiEdit size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setInstructorToDelete(ins.id || ins.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            {instructors.length === 0 && (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No instructors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing {instructors.length} entries
        </p>


        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 border rounded bg-[#0c2d50] text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded bg-gray-100">Next</button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-80 shadow">
            <h3 className="text-lg font-semibold mb-4">Delete Instructor?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this instructor?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteInstructor}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
