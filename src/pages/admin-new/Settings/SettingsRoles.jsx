import React, { useState, useEffect } from 'react';
import { Shield, Save, Edit, Trash2, X, CheckSquare, Square, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

const SettingsRoles = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState([]);
    const [rolePermissions, setRolePermissions] = useState({});
    const [editingRole, setEditingRole] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Authorization Context (Simplification: assuming admin token is handled by interceptor)
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await api.get('/roles');
            const data = res.data;

            if (data.success) {
                const apiRoles = data.data;
                const permissionsMap = {};
                apiRoles.forEach(r => {
                    permissionsMap[r.name] = (typeof r.permissions === 'string') ? JSON.parse(r.permissions) : r.permissions;
                });
                setRoles(apiRoles);
                setRolePermissions(permissionsMap);
            } else {
                // Fallback to defaults if API fails or empty
                console.warn("Using default roles due to API error or empty data");
                setupDefaults();
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setupDefaults();
        } finally {
            setLoading(false);
        }
    };

    const setupDefaults = () => {
        // Mock data for fallback
        const defaultRoles = [
            { id: 1, name: 'Super Admin', users: 2, color: '#DC2626', immutable: true },
            { id: 2, name: 'Admin', users: 5, color: '#EA580C', immutable: true },
            { id: 3, name: 'Instructor', users: 45, color: '#2563EB' },
            { id: 4, name: 'Artist', users: 23, color: '#7C3AED' },
            { id: 5, name: 'User', users: 1234, color: '#6B7280' }
        ];
        const defaultPerms = {
            'Super Admin': { Courses: { view: true, create: true, edit: true, delete: true }, Settings: { view: true, create: true, edit: true, delete: true } },
            'User': { Courses: { view: true, create: false }, Settings: { view: false } }
        };
        setRoles(defaultRoles);
        setRolePermissions(defaultPerms);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEditPermissions = (roleName) => {
        setEditingRole(roleName);
        // Ensure structure exists
        if (!rolePermissions[roleName]) {
            setRolePermissions(prev => ({
                ...prev,
                [roleName]: { Courses: { view: false }, Users: { view: false }, Settings: { view: false } } // Basic default structure
            }));
        }
        setShowModal(true);
    };

    const handlePermissionChange = (module, action, value) => {
        setRolePermissions(prev => ({
            ...prev,
            [editingRole]: {
                ...prev[editingRole],
                [module]: {
                    ...prev[editingRole]?.[module],
                    [action]: value
                }
            }
        }));
    };

    const handleSavePermissions = async () => {
        setSaving(true);
        try {
            const roleToUpdate = roles.find(r => r.name === editingRole);
            if (!roleToUpdate) throw new Error("Role not found");

            const res = await api.put(`/roles/${roleToUpdate.id}`, {
                permissions: rolePermissions[editingRole]
            });

            if (res.status === 200) {
                setShowModal(false);
                setEditingRole(null);
                alert('Permissions updated successfully!');
                fetchRoles(); // Refresh
            } else {
                alert('Failed to save permissions');
            }
        } catch (error) {
            console.error("Save error:", error);
            alert('Error saving permissions');
        } finally {
            setSaving(false);
        }
    };

    // Add Role Logic (Simplified for this task, usually needs a separate modal)
    const handleAddRole = async () => {
        const name = prompt("Enter new role name:");
        if (!name) return;

        try {
            const res = await api.post('/roles', { name, permissions: {}, color: '#3B82F6' });
            if (res.status === 200 || res.status === 201) {
                fetchRoles();
            } else {
                alert('Failed to create role');
            }
        } catch (e) { console.error(e); }
    };


    if (loading) return <div className="p-8">Loading permissions...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Gradient Banner */}
            <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Shield className="h-8 w-8" />
                        Roles & Permissions
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        Manage user roles and define access control policies.
                    </p>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full -mt-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">

                    {/* Roles List */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Shield size={20} className="text-blue-600" />
                                Defined Roles
                            </h2>
                            <button
                                onClick={handleAddRole}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                            >
                                <span className="text-xl leading-none">+</span> Add Role
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {roles.map((role, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                                        <div>
                                            <div className="font-semibold text-gray-800">{role.name}</div>
                                            <div className="text-sm text-gray-500">{role.users} active users</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditPermissions(role.name)}
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:text-blue-600 font-medium text-sm flex items-center gap-2 shadow-sm transition-colors"
                                        >
                                            <Edit size={14} />
                                            Configure
                                        </button>
                                        {!role.immutable && (
                                            <button className="px-4 py-2 bg-white border border-red-100 text-red-600 rounded-md hover:bg-red-50 font-medium text-sm flex items-center gap-2 shadow-sm transition-colors">
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                        <div className="text-blue-500 mt-1"><AlertCircle size={20} /></div>
                        <div>
                            <h4 className="font-semibold text-blue-900">Permission Matrix</h4>
                            <p className="text-sm text-blue-800 mt-1">
                                Click "Configure" on a role to open the detailed permission matrix editor. Changes affect all users with that role immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Editor Modal */}
            {showModal && editingRole && rolePermissions[editingRole] && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Edit Permissions: <span className="text-blue-600">{editingRole}</span>
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Check the boxes to grant access privileges.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable Table */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">Module</th>
                                        <th className="px-6 py-3 text-center">View</th>
                                        <th className="px-6 py-3 text-center">Create</th>
                                        <th className="px-6 py-3 text-center">Edit</th>
                                        <th className="px-6 py-3 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(rolePermissions[editingRole]).map((module) => (
                                        <tr key={module} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{module}</td>
                                            {['view', 'create', 'edit', 'delete'].map(action => (
                                                <td key={action} className="px-6 py-4 text-center">
                                                    <div className="flex justify-center">
                                                        <label className="relative inline-flex items-center cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={rolePermissions[editingRole][module][action] || false}
                                                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                                            />
                                                            <div className={`
                                                                w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200
                                                                ${rolePermissions[editingRole][module][action]
                                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm scale-110'
                                                                    : 'border-gray-300 text-transparent group-hover:border-blue-400'}
                                                            `}>
                                                                <CheckSquare size={14} strokeWidth={3} />
                                                            </div>
                                                        </label>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePermissions}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsRoles;
