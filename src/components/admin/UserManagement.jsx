import React, { useState } from 'react';
import { Trash2, Plus, Edit, X } from 'lucide-react';
import { useData } from '../../context/useData';
import RichTextEditor from '../RichTextEditor';

const UserManagement = () => {
    const { users, addUser, deleteUser, updateUser, toggleUserStatus } = useData();
    const [activeRoleFilter, setActiveRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        role: 'user',
        password: '',
        detail: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        profilePicture: '',
        facebookUrl: '',
        youtubeUrl: '',
        twitterUrl: '',
        linkedinUrl: '',
        status: 'active'
    });

    const resetUserForm = () => {
        setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            role: 'user',
            password: '',
            detail: '',
            address: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            profilePicture: '',
            facebookUrl: '',
            youtubeUrl: '',
            twitterUrl: '',
            linkedinUrl: '',
            status: 'active'
        });
        setEditingUser(null);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            mobile: user.mobile || '',
            role: user.role || 'user',
            password: user.password || '',
            detail: user.detail || '',
            address: user.address || '',
            country: user.country || '',
            state: user.state || '',
            city: user.city || '',
            pincode: user.pincode || '',
            profilePicture: user.profilePicture || '',
            facebookUrl: user.facebookUrl || '',
            youtubeUrl: user.youtubeUrl || '',
            twitterUrl: user.twitterUrl || '',
            linkedinUrl: user.linkedinUrl || '',
            status: user.status || 'active'
        });
        setShowAddUserModal(true);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            // Combine firstName and lastName into name for backend
            const userData = {
                ...newUser,
                name: `${newUser.firstName} ${newUser.lastName}`.trim()
            };

            // Remove firstName and lastName as backend doesn't expect them
            delete userData.firstName;
            delete userData.lastName;

            let result;
            if (editingUser) {
                result = await updateUser(editingUser.id || editingUser.id, userData);
            } else {
                result = await addUser(userData);
            }

            if (result && result.success) {
                setShowAddUserModal(false);
                resetUserForm();
                alert(editingUser ? 'User updated successfully!' : 'User created successfully!');
            } else {
                alert(`Error: ${result?.error || 'Failed to save user'}`);
            }
        } catch (error) {
            console.error('Error submitting user:', error);
            alert('An error occurred while saving the user');
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length > 0 && window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
            selectedUsers.forEach(id => deleteUser(id));
            setSelectedUsers([]);
        }
    };

    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    // Filter and search logic
    const filteredUsers = users.filter(user => {
        const matchesRole = activeRoleFilter === 'all' || user.role === activeRoleFilter;
        const matchesSearch = searchTerm === '' ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.mobile && user.mobile.includes(searchTerm));
        return matchesRole && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + entriesPerPage);

    return (
        <div>
            {/* Role Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid #E5E7EB' }}>
                {['all', 'user', 'instructor', 'admin', 'gaushala_owner', 'artist'].map(role => (
                    <button
                        key={role}
                        onClick={() => { setActiveRoleFilter(role); setCurrentPage(1); }}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeRoleFilter === role ? '2px solid var(--color-primary)' : 'none',
                            color: activeRoleFilter === role ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {role === 'all' ? 'All Users' : `${role}s`}
                    </button>
                ))}
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>Show</span>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span style={{ fontSize: '0.9rem' }}>entries</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB', minWidth: '250px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedUsers.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} /> Delete Selected ({selectedUsers.length})
                        </button>
                    )}
                    <button
                        onClick={() => { resetUserForm(); setShowAddUserModal(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                    >
                        <Plus size={16} /> Add User
                    </button>
                    <button style={{ padding: '8px 16px', backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        Import
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={toggleSelectAll}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Profile Picture</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>User Details</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Login As User</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user, index) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '12px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelectUser(user.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                                <td style={{ padding: '12px' }}>{startIndex + index + 1}</td>
                                <td style={{ padding: '12px' }}>
                                    <img
                                        src={user.profilePicture || 'https://via.placeholder.com/40'}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{user.email}</div>
                                    {user.mobile && <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{user.mobile}</div>}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        backgroundColor: user.role === 'admin' ? '#FEE2E2' : user.role === 'instructor' ? '#DBEAFE' : '#F3F4F6',
                                        color: user.role === 'admin' ? '#B91C1C' : user.role === 'instructor' ? '#1E40AF' : '#374151'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6B7280' }}>{user.loginAsUser || user.email}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                        <input
                                            type="checkbox"
                                            checked={user.status === 'active'}
                                            onChange={() => toggleUserStatus(user.id)}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: user.status === 'active' ? '#10B981' : '#D1D5DB',
                                            transition: '0.4s',
                                            borderRadius: '24px'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                content: '',
                                                height: '18px',
                                                width: '18px',
                                                left: user.status === 'active' ? '23px' : '3px',
                                                bottom: '3px',
                                                backgroundColor: 'white',
                                                transition: '0.4s',
                                                borderRadius: '50%'
                                            }}></span>
                                        </span>
                                    </label>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            style={{ padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}
                                            title="Edit User"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => window.confirm('Delete this user?') && deleteUser(user.id)}
                                            style={{ padding: '6px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#FEF2F2' }}
                                            title="Delete User"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', backgroundColor: 'white' }}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    padding: '6px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: currentPage === i + 1 ? 'var(--color-primary)' : 'white',
                                    color: currentPage === i + 1 ? 'white' : '#374151'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', backgroundColor: 'white' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {showAddUserModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }} onClick={() => setShowAddUserModal(false)}>
                    <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                            <h2 style={{ margin: 0 }}>{editingUser ? 'Edit User' : 'Create A New User'}</h2>
                            <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitUser} style={{ padding: '20px' }}>
                            {/* Personal Details */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#374151' }}>Personal Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Please Enter First Name"
                                            value={newUser.firstName}
                                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Last Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Please Enter Last Name"
                                            value={newUser.lastName}
                                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Email *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="Please Enter Email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Mobile *</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Please Enter Mobile"
                                            value={newUser.mobile}
                                            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Select User Role *</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        >
                                            <option value="user">User</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="admin">Admin</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="artist">Artist</option>
                                            <option value="gaushala_owner">Gaushala Owner</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Password *</label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            placeholder="Please Enter Password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Detail</label>
                                    <RichTextEditor
                                        value={newUser.detail}
                                        onChange={(content) => setNewUser({ ...newUser, detail: content })}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#374151' }}>Address</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Address</label>
                                        <input
                                            type="text"
                                            placeholder="Please Enter Address"
                                            value={newUser.address}
                                            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Country</label>
                                        <input
                                            type="text"
                                            placeholder="Select Country"
                                            value={newUser.country}
                                            onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>State</label>
                                        <input
                                            type="text"
                                            placeholder="Select State"
                                            value={newUser.state}
                                            onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>City</label>
                                        <input
                                            type="text"
                                            placeholder="Select City"
                                            value={newUser.city}
                                            onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Pincode</label>
                                        <input
                                            type="text"
                                            placeholder="Please Enter Pin"
                                            value={newUser.pincode}
                                            onChange={(e) => setNewUser({ ...newUser, pincode: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Profile Picture (URL)</label>
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={newUser.profilePicture}
                                            onChange={(e) => setNewUser({ ...newUser, profilePicture: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Social Profile */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#374151' }}>Social Profile</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Facebook URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://facebook.com/"
                                            value={newUser.facebookUrl}
                                            onChange={(e) => setNewUser({ ...newUser, facebookUrl: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>YouTube URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/"
                                            value={newUser.youtubeUrl}
                                            onChange={(e) => setNewUser({ ...newUser, youtubeUrl: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Twitter URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://twitter.com/"
                                            value={newUser.twitterUrl}
                                            onChange={(e) => setNewUser({ ...newUser, twitterUrl: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>LinkedIn URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://linkedin.com/"
                                            value={newUser.linkedinUrl}
                                            onChange={(e) => setNewUser({ ...newUser, linkedinUrl: e.target.value })}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#374151' }}>Status</h3>
                                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '30px' }}>
                                    <input
                                        type="checkbox"
                                        checked={newUser.status === 'active'}
                                        onChange={(e) => setNewUser({ ...newUser, status: e.target.checked ? 'active' : 'inactive' })}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: newUser.status === 'active' ? '#10B981' : '#D1D5DB',
                                        transition: '0.4s',
                                        borderRadius: '30px'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            content: '',
                                            height: '24px',
                                            width: '24px',
                                            left: newUser.status === 'active' ? '33px' : '3px',
                                            bottom: '3px',
                                            backgroundColor: 'white',
                                            transition: '0.4s',
                                            borderRadius: '50%'
                                        }}></span>
                                    </span>
                                </label>
                                <span style={{ marginLeft: '12px', color: '#374151' }}>{newUser.status === 'active' ? 'Active' : 'Inactive'}</span>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddUserModal(false)}
                                    style={{ padding: '10px 24px', border: '1px solid #D1D5DB', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'white' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
