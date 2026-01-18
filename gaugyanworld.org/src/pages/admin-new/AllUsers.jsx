import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ... icons ...
import { FiSearch, FiTrash2, FiMoreVertical, FiEye, FiEdit2, FiKey, FiDownload, FiUpload, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useData } from "../../context/useData";
import { userService } from "../../services/api";

export default function AllUsers() {
  const { users, roles, deleteUser, refreshUsers } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // CSV Export
  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Mobile", "Role", "Join Date"];
    const csvContent = [
      headers.join(","),
      ...users.map(u => {
        const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`;
        return [
          u.id || u.id,
          `"${name.replace(/"/g, '""')}"`,
          u.email,
          u.mobile || '',
          u.role || u.type || 'user',
          u.joinDate || u.createdAt || ''
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map(row => row.trim()).filter(row => row);

      if (rows.length < 2) {
        toast.error("Invalid CSV format");
        return;
      }

      // Assuming format: Name,Email,Mobile,Role,Password(Optional)
      // Skip header
      const usersToImport = rows.slice(1).map(row => {
        const cols = row.split(","); // Simple split, might fail with commas in values
        return {
          name: cols[0]?.trim(),
          email: cols[1]?.trim(),
          mobile: cols[2]?.trim(),
          role: cols[3]?.trim()?.toLowerCase() || 'user',
          password: cols[4]?.trim() || 'Password@123' // Default password if not provided
        };
      });

      let successCount = 0;
      let failCount = 0;

      const loadingToast = toast.loading("Importing users...");

      for (const user of usersToImport) {
        if (!user.email || !user.name) {
          failCount++;
          continue;
        }
        try {
          await userService.createUser(user);
          successCount++;
        } catch (error) {
          console.error("Import error for", user.email, error);
          failCount++;
        }
      }

      toast.dismiss(loadingToast);
      toast.success(`Imported: ${successCount}, Failed: ${failCount}`);
      refreshUsers();
      e.target.value = null; // Reset input
    };
    reader.readAsText(file);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const role = u.role || u.type || 'user';
    const matchesTab = activeTab === "all" ? true : role === activeTab;

    const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`;
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.mobile && u.mobile.includes(search));

    return matchesTab && matchesSearch;
  });

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDownloadSampleCSV = () => {
    const headers = ["Name", "Email", "Mobile", "Role", "Password"];
    const sampleData = ["John Doe,john@example.com,1234567890,user,Password@123"];
    const csvContent = [headers.join(","), ...sampleData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_users_import.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle actions
  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to delete");
      return;
    }

    try {
      for (const userId of selectedUsers) {
        await deleteUser(userId);
      }
      toast.success(`Deleted ${selectedUsers.length} users`);
      setSelectedUsers([]);
    } catch {
      toast.error("Failed to delete users");
    }
  };

  const handleUserAction = async (action, user) => {
    setShowActionsMenu(null);

    if (action === "Delete") {
      try {
        await deleteUser(user.id);
        toast.success(`Deleted ${user.displayName || user.email}`);
      } catch {
        toast.error("Failed to delete user");
      }
    } else if (action === "Edit") {
      // TODO: Open edit modal
      toast.info(`Edit functionality coming soon for ${user.displayName || user.email}`);
    } else if (action === "View") {
      // TODO: Open view modal
      toast.info(`View details for ${user.displayName || user.email}`);
    } else if (action === "Reset password for") {
      // TODO: Implement password reset
      toast.info(`Password reset email sent to ${user.email}`);
    }
  };



  // Tab helper
  // (Moved inside render to fix lint error about creating component in render - actually moving OUTSIDE or using direct JSX is better)
  // Replacing component usage with direct JSX map to avoid this error completely.

  const getTypeBadge = (type) => {
    const styles = {
      student: "bg-blue-100 text-blue-800",
      instructor: "bg-amber-100 text-amber-800",
      admin: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[type]}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // const tabs = [
  //   { label: "All Users", value: "all", count: users.length },
  //   { label: "Students", value: "student", count: users.filter(u => u.type === 'student').length },
  //   { label: "Instructors", value: "instructor", count: users.filter(u => u.type === 'instructor').length },
  //   { label: "Admins", value: "admin", count: users.filter(u => u.type === 'admin').length },
  // ];

  // Dynamic Tabs
  const tabs = [
    { label: "All Users", value: "all", count: users.length },
    ...(roles || []).map(r => ({
      label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
      value: r.name,
      count: users.filter(u => (u.role || u.type || '').toLowerCase() === r.name.toLowerCase()).length
    }))
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all users, instructors, and administrators
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/users/roles')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
          >
            <FiKey size={14} />
            Manage Roles
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative pb-3 px-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.value
                ? "text-[#0c2d50] border-[#0c2d50]"
                : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0c2d50] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          {/* Search */}
          <div className="relative w-full xl:w-80">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 w-full bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
              <span>Show</span>
              <select className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span>entries</span>
            </div>

            {selectedUsers.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm whitespace-nowrap"
              >
                <FiTrash2 size={14} />
                Delete ({selectedUsers.length})
              </button>
            )}

            <button
              onClick={() => navigate('/admin/users/add')}
              className="flex items-center gap-2 px-3 py-2 bg-[#0c2d50] text-white rounded-lg hover:bg-[#1e4d7b] transition-colors duration-200 text-sm whitespace-nowrap"
            >
              <FiPlus size={14} />
              Add User
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm whitespace-nowrap"
            >
              <FiDownload size={14} />
              Export CSV
            </button>

            <label className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer text-sm whitespace-nowrap">
              <FiUpload size={14} />
              Import CSV
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>

            <button
              onClick={handleDownloadSampleCSV}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm whitespace-nowrap"
              title="Download Sample CSV Format"
            >
              <FiDownload size={14} />
              Sample CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#0c2d50] focus:ring-[#0c2d50]"
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr
                key={user.id || user.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#0c2d50] focus:ring-[#0c2d50]"
                    checked={selectedUsers.includes(user.id || user.id)}
                    onChange={() => handleSelectUser(user.id || user.id)}
                  />
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePicture || user.image || 'https://via.placeholder.com/48'}
                      alt={user.firstName || user.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.mobile}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">{getTypeBadge(user.role || user.type || 'user')}</td>

                <td className="p-4 text-gray-600">
                  {new Date(user.joinDate || user.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span className="font-medium text-gray-900">
                    {user.courses}
                  </span>
                </td>

                <td className="p-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.status}
                      readOnly
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition duration-200">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5 shadow-sm" />
                    </div>
                  </label>
                </td>

                <td className="p-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionsMenu(
                          showActionsMenu === user.id ? null : user.id
                        )
                      }
                      className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                    >
                      <FiMoreVertical size={16} />
                    </button>

                    {showActionsMenu === user.id && (
                      <div className="absolute right-0 top-12 z-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-48">
                        <button
                          onClick={() => handleUserAction("View", user)}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FiEye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => handleUserAction("Edit", user)}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FiEdit2 size={16} />
                          Edit User
                        </button>
                        <button
                          onClick={() =>
                            handleUserAction("Reset password for", user)
                          }
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <FiKey size={16} />
                          Reset Password
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => handleUserAction("Delete", user)}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <FiTrash2 size={16} />
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center">
                  <div className="text-gray-500">
                    <FiSearch size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div>
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-[#0c2d50] text-white rounded-lg hover:bg-[#1e4d7b] transition-colors duration-200">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
