import { useState, useEffect } from "react";
import { FiMoreVertical, FiUsers, FiPlus, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Toaster, toast } from 'react-hot-toast';
import api from "../../../services/api"; // Assuming api export default is axios instance
import { useData } from "../../../context/useData";

export default function RolesAndPermission() {
  const { users, refreshUsers } = useData();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newPermissions, setNewPermissions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Toggle permission helper
  const togglePermission = (resource, action) => {
    setNewPermissions(prev => {
      const current = prev[resource] || {};
      return {
        ...prev,
        [resource]: { ...current, [action]: !current[action] }
      };
    });
  };

  // Fetch Roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/roles');
      if (response.data && response.data.success) {
        setRoles(response.data.data);
      } else {
        console.error("Failed to fetch roles format", response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    refreshUsers();
  }, [refreshUsers]);


  // Calculate active users per role dynamically
  const getActiveUserCount = (roleName) => {
    return users.filter(u =>
      (u.role && u.role.toLowerCase() === roleName.toLowerCase()) ||
      (u.type && u.type.toLowerCase() === roleName.toLowerCase())
    ).length;
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setNewPermissions(role.permissions || {});
    setShowModal(true);
  };

  const handleDelete = async (id, isSystem) => {
    if (isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await api.delete(`/roles/${id}`);
      if (response.data.success) {
        toast.success("Role deleted");
        fetchRoles();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete role");
    }
  };

  const handleCreateOrUpdateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      setSubmitting(true);

      let response;
      const roleData = {
        name: newRoleName.toLowerCase(),
        permissions: newPermissions,
        color: '#10B981'
      };

      if (editingRole) {
        response = await api.put(`/roles/${editingRole.id}`, roleData);
      } else {
        response = await api.post('/roles', roleData);
      }

      if (response.data.success) {
        toast.success(editingRole ? "Role updated successfully!" : "Role created successfully!");
        setNewRoleName("");
        setNewPermissions({});
        setEditingRole(null);
        setShowModal(false);
        fetchRoles(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || (editingRole ? "Failed to update role" : "Failed to create role"));
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setNewRoleName("");
    setNewPermissions({});
  }

  // Filter roles
  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);
  const paginated = filtered.slice((page - 1) * entries, page * entries);

  return (
    <div className="bg-white p-8 rounded-xl shadow border border-gray-100 relative">
      <Toaster />

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user roles and access their permissions.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingRole(null);
              setNewRoleName("");
              setNewPermissions({});
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#0c2d50] text-white px-4 py-2 rounded-lg hover:bg-[#0a2340] transition-colors"
          >
            <FiPlus /> Create New User Type
          </button>
        </div>
      </div>

      {/* TOP FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-5 mb-4 p-6 pb-0">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 bg-gray-50"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>entries</span>
        </div>

        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded px-3 py-1 bg-gray-50"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 w-16">#</th>
              <th className="p-3">Role Name</th>
              <th className="p-3">Active Users</th>
              <th className="p-3">Permissions</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading roles...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No roles found.</td></tr>
            ) : (
              paginated.map((role, index) => (
                <tr
                  key={role.id || index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-3">{(page - 1) * entries + index + 1}</td>
                  <td className="p-3 capitalize font-medium">{role.name}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FiUsers /> {getActiveUserCount(role.name)}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {role.permissions && Object.keys(role.permissions).length > 0 ? (
                      <span>Configured</span>
                    ) : (
                      role.name === 'admin' ? <span>Full Access</span> : <span>Default Access</span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 border rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit Role"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => handleDelete(role.id, role.isSystem)}
                          className="p-2 border rounded-full hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Role"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between p-6 pt-0 flex-wrap gap-4">
        <p className="text-gray-600 text-sm">
          Showing <strong>{(page - 1) * entries + 1}</strong> to <strong>{Math.min(page * entries, filtered.length)}</strong> of <strong>{filtered.length}</strong> entries
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 border rounded ${page === 1 ? "opacity-40" : "hover:bg-gray-100"}`}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 border rounded ${page === totalPages || totalPages === 0 ? "opacity-40" : "hover:bg-gray-100"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* CREATE/EDIT ROLE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingRole ? 'Edit User Type' : 'Create New User Type'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateRole}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Editor, Moderator, Manager"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c2d50] focus:border-transparent outline-none transition-all"
                  autoFocus
                  disabled={editingRole && editingRole.isSystem}
                />

                {editingRole && editingRole.isSystem && (
                  <p className="text-xs text-orange-500 mt-2">
                    System role names cannot be changed.
                  </p>
                )}
                {!editingRole && (
                  <p className="text-xs text-gray-500 mt-2">
                    Use lowercase letters (e.g., 'manager'). Spaces will be handled automatically.
                  </p>
                )}
              </div>

              {/* Permissions Matrix */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2">Module</th>
                        <th className="px-4 py-2 text-center">View (Own)</th>
                        <th className="px-4 py-2 text-center">Edit</th>
                        <th className="px-4 py-2 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: 'users', label: 'Users' },
                        { id: 'courses', label: 'Courses' },
                        { id: 'products', label: 'Products' },
                        { id: 'orders', label: 'Orders' },
                        { id: 'music', label: 'Music & Podcasts' },
                        { id: 'news', label: 'News & Blogs' },
                        { id: 'gaushalas', label: 'Gaushala' }
                      ].map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-700">{res.label}</td>
                          {['view_own', 'edit', 'delete'].map(action => (
                            <td key={action} className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={newPermissions[res.id]?.[action] || false}
                                onChange={() => togglePermission(res.id, action)}
                                className="rounded border-gray-300 text-[#0c2d50] focus:ring-[#0c2d50]"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRoleName.trim() || submitting}
                  className="px-6 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#0a2340] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  {submitting ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

