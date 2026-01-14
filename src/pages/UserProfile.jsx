import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import UserDashboardLayout from '../layout/UserDashboardLayout';

const UserProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        bio: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                bio: user.bio || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Split displayName back to firstName/lastName if needed by backend, 
            // or send as is if backend supports displayName.
            // Looking at AuthContext, api.put('/v1/auth/profile', updates) is called.
            // Usually backend expects firstName/lastName.
            const nameParts = formData.displayName.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            await updateUserProfile({
                firstName,
                lastName,
                phoneNumber: formData.phoneNumber,
                bio: formData.bio,
                location: formData.location
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserDashboardLayout title="Settings" subtitle="Manage your profile and account preferences">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                    <p className="text-gray-500 text-sm mt-1">Update your account's profile information and email address.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Profile Photo - Placeholder for now as file upload requires deeper integration */}
                    <div className="flex items-center space-x-6">
                        <div className="shrink-0 relative">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <span>{formData.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                                title="Change photo (Coming Soon)"
                                onClick={() => toast('Photo upload coming soon!', { icon: '📷' })}
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                            <p className="text-gray-500 text-sm">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="displayName"
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border text-gray-500 cursor-not-allowed"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-gray-400" />
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Email address cannot be changed.</p>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio / About
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                    placeholder="Tell us a little about yourself"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                'Saving...'
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </UserDashboardLayout>
    );
};

export default UserProfile;
