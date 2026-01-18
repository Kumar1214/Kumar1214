import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Mic, Music, BarChart2, DollarSign, Settings, Plus, Upload, Calendar, Search, Filter, MoreVertical, LayoutDashboard, Disc, Radio, Activity, Wallet, Users, X, Globe, Bell, LogOut, Play, Pause, Trash2, Edit2, Share2 } from 'lucide-react';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import WalletSection from '../components/dashboard/WalletSection';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import OnboardingWidget from '../components/dashboard/OnboardingWidget';
import AlertSection from '../components/dashboard/AlertSection';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ArtistDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

    // Data States
    const [myMusic, setMyMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadType, setUploadType] = useState('music'); // music, podcast

    // Settings / Profile State
    const [artistProfile, setArtistProfile] = useState({
        artistName: '',
        bio: '',
        genre: '',
        socialLinks: { instagram: '', youtube: '', spotify: '', website: '' }
    });

    // New Release State
    const [newTrack, setNewTrack] = useState({ title: '', genre: 'Classical', mood: 'Peaceful', mediaUrl: '', image: '', releaseDate: '', status: 'pending_approval' });


    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                // Fetch my uploaded music using new filter
                const { data } = await api.get(`/music?uploadedBy=${user.id}`);
                setMyMusic(data.data || []);

                // Parse existing profile details
                if (user.detail) {
                    try {
                        const parsed = JSON.parse(user.detail);
                        setArtistProfile({
                            artistName: parsed.artistName || user.displayName || '',
                            bio: parsed.bio || '',
                            genre: parsed.genre || '',
                            socialLinks: parsed.socialLinks || { instagram: '', youtube: '', spotify: '', website: '' }
                        });
                    } catch (e) {
                        console.log("Error parsing user details", e);
                    }
                } else {
                    setArtistProfile(prev => ({ ...prev, artistName: user.displayName || '' }));
                }

            } catch (err) {
                console.error("Failed to fetch artist data", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchArtistData();
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const detailString = JSON.stringify(artistProfile);
            // Assuming /auth/profile updates the 'detail' field on the User model
            await api.put('/v1/auth/profile', {
                detail: detailString,
                displayName: artistProfile.artistName // Also update main display name if possible
            });
            alert("Profile settings saved successfully!");
        } catch (err) {
            console.error("Failed to save profile", err);
            alert("Failed to save settings.");
        }
    };

    // Analytics Calculation
    const analytics = useMemo(() => {
        const totalTracks = myMusic.length;
        const totalViews = myMusic.reduce((acc, m) => acc + (m.views || 0), 0);
        const estimatedEarnings = (totalViews * 0.10).toFixed(2); // Mock calculation: ₹0.10 per play

        // Chart Data: Top 5 Tracks
        const topTracks = [...myMusic]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
            .map(t => ({ name: t.title, views: t.views || 0 }));

        return { totalTracks, totalViews, estimatedEarnings, topTracks };
    }, [myMusic]);

    // Pending/Planned Releases
    const plannedReleases = myMusic.filter(m => m.status === 'pending_approval');

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await api.post('/music', { ...newTrack, uploadedBy: user.id }); // uploadedBy handled by logic/backend too
            // Refresh
            const { data } = await api.get(`/music?uploadedBy=${user.id}`);
            setMyMusic(data.data || []);
            setShowUploadModal(false);
            setNewTrack({ title: '', genre: 'Classical', mood: 'Peaceful', mediaUrl: '', image: '', releaseDate: '', status: 'pending_approval' });
            alert("Track uploaded successfully!");
        } catch (err) {
            alert("Upload failed.");
        }
    };

    const onboardingTasks = [
        { label: 'Create Artist Profile', description: 'Add bio & social links', completed: true },
        { label: 'Upload First Track', description: 'Music or Podcast', completed: myMusic.length > 0 },
        { label: 'Verify Copyright', description: 'Submit declaration', completed: false },
    ];

    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutDashboard, onClick: () => setActiveTab('overview') },
        { path: '#music', label: 'My Music', icon: Music, onClick: () => setActiveTab('music') },
        { path: '#analytics', label: 'Analytics', icon: BarChart2, onClick: () => setActiveTab('analytics') },
        { path: '#earnings', label: 'Earnings', icon: DollarSign, onClick: () => setActiveTab('earnings') },
        { path: '#wallet', label: 'Wallet', icon: Wallet, onClick: () => setActiveTab('wallet') },
        { path: '#community', label: 'Community', icon: Users, onClick: () => setActiveTab('community') },
        { path: '#notifications', label: 'Notifications', icon: Bell, onClick: () => setActiveTab('notifications') },
        { path: '#planning', label: 'Release Planner', icon: Calendar, onClick: () => setActiveTab('planning') },
        { path: '#settings', label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
    ];

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Artist Studio"
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        >
            <div className="relative">
                {/* Header Action */}
                <div className="absolute top-0 right-0 -mt-16 hidden lg:flex">
                    <Button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-colors border-none"
                    >
                        <Upload size={18} /> Upload
                    </Button>
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-500 text-sm">Total Streams</h3>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalViews.toLocaleString()}</div>
                                    <div className="text-xs text-green-600 font-medium mt-1">+12% this week</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-500 text-sm">Est. Earnings</h3>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">₹{analytics.estimatedEarnings}</div>
                                    <div className="text-xs text-gray-500 mt-1">Pending Payout</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-500 text-sm">Total Tracks</h3>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalTracks}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Top Tracks Chart */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Tracks</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analytics.topTracks} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                                    <Bar dataKey="views" fill="#db2777" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <OnboardingWidget title="Artist Checklist" tasks={onboardingTasks} completedCount={onboardingTasks.filter(t => t.completed).length} />
                                    {/* Upcoming Releases Mini */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4">Upcoming Releases</h3>
                                        {plannedReleases.length === 0 ? <p className="text-gray-500 text-sm">No scheduled releases.</p> : (
                                            <div className="space-y-3">
                                                {plannedReleases.slice(0, 3).map(r => (
                                                    <div key={r.id} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400"><Disc size={16} /></div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="font-medium text-sm truncate">{r.title}</p>
                                                            <p className="text-xs text-orange-600">Pending Review</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={() => setActiveTab('planning')} className="text-sm text-pink-600 font-medium hover:underline">View Planner</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'wallet' && <WalletSection />}
                    {activeTab === 'community' && <h3 className="text-xl font-bold">Community Coming Soon</h3>}
                    {activeTab === 'notifications' && <NotificationCenter />}

                    {
                        (activeTab === 'music' || activeTab === 'analytics') && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">{activeTab === 'music' ? 'My Library' : 'Detailed Analytics'}</h3>
                                    {activeTab === 'music' && <Button onClick={() => setShowUploadModal(true)} className="bg-pink-600 text-white"><Plus size={16} className="mr-2" /> Upload New</Button>}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Track</th>
                                                <th className="px-6 py-4">Genre</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Streams</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {myMusic.map(m => (
                                                <tr key={m.id} className="hover:bg-gray-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={m.image || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded object-cover" />
                                                            <span className="font-medium text-gray-900">{m.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{m.genre}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {m.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono">{m.views?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'earnings' && (
                            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
                                <h3 className="text-xl font-bold mb-2">Total Earnings</h3>
                                <div className="text-5xl font-extrabold text-green-600 mb-4">₹{analytics.estimatedEarnings}</div>
                                <p className="text-gray-500 mb-8">Calculated based on {analytics.totalViews} total streams across all platforms.</p>
                                <div className="flex justify-center gap-4">
                                    <Button className="bg-gray-100 text-gray-900">Download Report</Button>
                                    <Button className="bg-green-600 text-white">Withdraw Funds</Button>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'planning' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">Release Schedule</h3>
                                    <div className="space-y-4">
                                        {plannedReleases.map(r => (
                                            <div key={r.id} className="flex border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r-lg">
                                                <div>
                                                    <p className="font-bold text-gray-900">{r.title}</p>
                                                    <p className="text-xs text-gray-600">Pending Approval • Est. Release: ASAP</p>
                                                </div>
                                            </div>
                                        ))}
                                        {plannedReleases.length === 0 && <p className="text-gray-500">No pending releases.</p>}
                                    </div>
                                </div>
                                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
                                    <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                                    <p className="text-indigo-200 mb-4">Schedule releases on Fridays to maximize weekend streaming numbers.</p>
                                    <Button onClick={() => setShowUploadModal(true)} className="bg-white text-indigo-900 w-full font-bold">Plan New Release</Button>
                                </div>
                            </div>
                        )
                    }

                    {activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-800">Artist Profile Settings</h3>
                                    <Button onClick={handleSaveProfile} className="bg-green-600 text-white px-6">Save Changes</Button>
                                </div>
                                <div className="p-8 space-y-8">
                                    {/* Profile Header section */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-32 h-32 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={40} className="text-gray-400" />
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <span className="text-white text-xs font-bold">Change</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Artist / Display Name</label>
                                                <input
                                                    type="text"
                                                    value={artistProfile.artistName}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, artistName: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                                                    placeholder="e.g. Pandit Ravi Shankar"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Bio / About</label>
                                                <textarea
                                                    value={artistProfile.bio}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, bio: e.target.value })}
                                                    rows={4}
                                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none transition resize-none"
                                                    placeholder="Tell your story..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    {/* Professional Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Genre</label>
                                            <select
                                                value={artistProfile.genre}
                                                onChange={(e) => setArtistProfile({ ...artistProfile, genre: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-pink-500 outline-none system-ui"
                                            >
                                                <option value="">Select Genre</option>
                                                <option value="Classical">Indian Classical</option>
                                                <option value="Folk">Folk & Traditional</option>
                                                <option value="Devotional">Bhajan & Devotional</option>
                                                <option value="Instrumental">Instrumental</option>
                                                <option value="Fusion">Fusion</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Level</label>
                                            <select className="w-full border border-gray-300 rounded-lg p-3 bg-white system-ui">
                                                <option>Professional</option>
                                                <option>Student</option>
                                                <option>Hobbyist</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    {/* Social Links */}
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe size={18} /> Social Connections</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400 text-sm">IG</span>
                                                <input
                                                    type="text"
                                                    value={artistProfile.socialLinks.instagram}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, socialLinks: { ...artistProfile.socialLinks, instagram: e.target.value } })}
                                                    className="w-full pl-10 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
                                                    placeholder="Instagram Username"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400 text-sm">YT</span>
                                                <input
                                                    type="text"
                                                    value={artistProfile.socialLinks.youtube}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, socialLinks: { ...artistProfile.socialLinks, youtube: e.target.value } })}
                                                    className="w-full pl-10 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
                                                    placeholder="YouTube Channel URL"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400 text-sm">SP</span>
                                                <input
                                                    type="text"
                                                    value={artistProfile.socialLinks.spotify}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, socialLinks: { ...artistProfile.socialLinks, spotify: e.target.value } })}
                                                    className="w-full pl-10 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
                                                    placeholder="Spotify Artist URL"
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400 text-sm">W</span>
                                                <input
                                                    type="text"
                                                    value={artistProfile.socialLinks.website}
                                                    onChange={(e) => setArtistProfile({ ...artistProfile, socialLinks: { ...artistProfile.socialLinks, website: e.target.value } })}
                                                    className="w-full pl-10 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 outline-none"
                                                    placeholder="Website URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div >
            </div >

            {/* Upload Modal */}
            {
                showUploadModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Upload New Content</h3>
                                <button onClick={() => setShowUploadModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <input value={newTrack.title} onChange={e => setNewTrack({ ...newTrack, title: e.target.value })} placeholder="Track Title" className="w-full border p-2 rounded" required />
                                <div className="flex gap-4">
                                    <select value={newTrack.genre} onChange={e => setNewTrack({ ...newTrack, genre: e.target.value })} className="flex-1 border p-2 rounded">
                                        <option>Classical</option>
                                        <option>Folk</option>
                                        <option>Bhajan</option>
                                        <option>Instrumental</option>
                                    </select>
                                    <input value={newTrack.mood} onChange={e => setNewTrack({ ...newTrack, mood: e.target.value })} placeholder="Mood" className="flex-1 border p-2 rounded" />
                                </div>
                                <input value={newTrack.image} onChange={e => setNewTrack({ ...newTrack, image: e.target.value })} placeholder="Cover Art URL" className="w-full border p-2 rounded" />
                                <input value={newTrack.mediaUrl} onChange={e => setNewTrack({ ...newTrack, mediaUrl: e.target.value })} placeholder="Audio File URL" className="w-full border p-2 rounded" required />
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Release Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={newTrack.releaseDate}
                                        onChange={e => setNewTrack({ ...newTrack, releaseDate: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <p className="text-xs text-gray-400">Leave blank for immediate release.</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded text-xs text-gray-500">
                                    By uploading, you confirm that you own the rights to this content.
                                </div>

                                <Button type="submit" className="w-full bg-pink-600 text-white">Submit for Release</Button>
                            </form>
                        </div>
                    </div>
                )
            }
        </DashboardLayout >
    );
};

export default ArtistDashboard;
