import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Users, Plus, Edit, Trash2, Search, Filter, Lock, Globe, Shield } from 'lucide-react';

const CommunityManager = () => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'public', icon: 'Users' });

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const { data } = await api.get('/community/groups');
            if (data.success) {
                setCommunities(data.groups);
            }
        } catch (error) {
            console.error('Failed to fetch communities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/community/groups', formData);
            alert('Community created successfully!');
            setShowModal(false);
            setFormData({ name: '', description: '', type: 'public', icon: 'Users' });
            fetchCommunities();
        } catch (error) {
            console.error('Create failed', error);
            alert('Failed to create community');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Community Management</h1>
                    <p className="text-gray-500 text-sm">Manage dynamic community groups and subscribers.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> Create Group
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Type</th>
                            <th className="p-4 font-semibold text-gray-600">Subscribers</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {communities.map(group => (
                            <tr key={group.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{group.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{group.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${group.type === 'public' ? 'bg-green-50 text-green-700 border-green-100' :
                                            group.type === 'private' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-purple-50 text-purple-700 border-purple-100'
                                        }`}>
                                        {group.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-700">{group.subscriberCount}</td>
                                <td className="p-4"><span className="text-green-600 text-sm font-bold">Active</span></td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-indigo-600 p-1"><Edit size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {communities.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-400">No communities found. Create one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Create New Community</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Photography Club"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Describe this community..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full border p-2 rounded-lg"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="pro_only">Pro Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Key</label>
                                    <select
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full border p-2 rounded-lg"
                                    >
                                        <option value="Users">Users (Default)</option>
                                        <option value="Music">Music</option>
                                        <option value="Star">Star</option>
                                        <option value="ShoppingBag">Shopping</option>
                                        <option value="TrendingUp">Trending</option>
                                        <option value="Compass">Compass</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition">Create Community</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityManager;
