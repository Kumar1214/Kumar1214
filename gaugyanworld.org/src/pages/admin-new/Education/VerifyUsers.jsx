import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiUserCheck,
  FiShield,
  FiDownload,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useData } from "../../../context/useData";

export default function VerifyUsers() {
  const { users, refreshUsers } = useData();
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter + Pagination Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`;
      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const isVerified = u.isVerified || u.verified || false;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "verified"
            ? isVerified
            : !isVerified;
      const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / entries);
  const paginated = filteredUsers.slice((page - 1) * entries, page * entries);

  const handleVerify = async (user) => {
    try {
      const response = await api.put(`/users/${user.id}/verify`);
      const data = response.data;
      if (data.success) {
        toast.success(`Verified ${user.name || user.firstName}`);
        refreshUsers();
      } else {
        toast.error(data.message || "Failed to verify user");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("An error occurred during verification");
    }
  };

  const handleReject = (user) => {
    toast.error(`Rejected verification for ${user.name || user.firstName}`);
  };

  const handleSendReminder = (user) => {
    toast.success(`Reminder sent to ${user.name}`);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FiShield className="text-purple-600" />;
      case "instructor":
        return <FiUserCheck className="text-blue-600" />;
      default:
        return <FiUser className="text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "instructor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Verification
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user verification status and approvals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:border-gray-400 transition-colors duration-200">
              <FiDownload size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 w-full lg:w-80 bg-white"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50] transition-all duration-200 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Entries Selector */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#0c2d50] focus:border-[#0c2d50]"
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
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
            {paginated.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0c2d50] to-[#1e4d7b] flex items-center justify-center text-white font-medium text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(user.createdAt || user.joinDate).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {user.isVerified || user.verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <FiCheckCircle size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <FiAlertCircle size={14} />
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {!(user.isVerified || user.verified) && (
                      <>
                        <button
                          onClick={() => handleVerify(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <FiCheckCircle size={14} />
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <FiXCircle size={14} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleSendReminder(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <FiSend size={14} />
                          Remind
                        </button>
                      </>
                    )}
                    {(user.isVerified || user.verified) && (
                      <span className="text-sm text-gray-500">
                        No actions available
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center">
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
            Showing <strong>{(page - 1) * entries + 1}</strong> to{" "}
            <strong>{Math.min(page * entries, filteredUsers.length)}</strong> of{" "}
            <strong>{filteredUsers.length}</strong> entries
            {search && (
              <span className="ml-2">
                (filtered from <strong>{users.length}</strong> total entries)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`p-2 rounded-lg border border-gray-300 transition-colors duration-200 ${page === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-white hover:border-gray-400"
                }`}
            >
              <FiChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${page === i + 1
                    ? "bg-[#0c2d50] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`p-2 rounded-lg border border-gray-300 transition-colors duration-200 ${page === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-white hover:border-gray-400"
                }`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
