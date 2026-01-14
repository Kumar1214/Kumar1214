import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Send, Image, User, Users, Compass, Star, TrendingUp, Search, Menu, X, ShoppingBag } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button';

const CommunityFeed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [activeCategory, setActiveCategory] = useState({ name: 'All', icon: Compass }); // Store full object
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);
    const [communities, setCommunities] = useState([]); // Dynamic list
    const [joinedCommunities, setJoinedCommunities] = useState([]);

    // Icon Mapping for dynamic categories (fallback)
    const getIcon = (iconName) => {
        const icons = { 'Users': Users, 'Music': MusicIcon, 'Star': Star, 'ShoppingBag': ShoppingBagIcon, 'TrendingUp': TrendingUp, 'Compass': Compass };
        return icons[iconName] || Users; // Default to Users
    };

    // Static "All" category
    const allCategory = { id: 'all', name: 'All', icon: Compass };

    const onlineUsers = [
        { id: 101, name: 'Anjali Gupta', status: 'online', avatar: 'https://i.pravatar.cc/150?u=101' },
        { id: 102, name: 'Rahul Verma', status: 'online', avatar: 'https://i.pravatar.cc/150?u=102' },
        { id: 103, name: 'Priya Singh', status: 'away', avatar: 'https://i.pravatar.cc/150?u=103' },
    ];

    const suggestions = [
        { id: 201, name: 'Pandit Sharma', role: 'Instructor', avatar: 'https://i.pravatar.cc/150?u=201' },
        { id: 202, name: 'Vedic Vibes', role: 'Artist', avatar: 'https://i.pravatar.cc/150?u=202' },
    ];

    useEffect(() => {
        fetchJoinedCommunities();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [activeCategory]);

    const fetchJoinedCommunities = async () => {
        try {
            const { data } = await api.get('/community/my-communities');
            setJoinedCommunities(data.joinedCommunities || []);
        } catch (err) {
            console.error("Failed to fetch joined communities", err);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/community?category=${activeCategory.name === 'All' ? '' : activeCategory.name}`);
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinToggle = async (category, e) => {
        e.stopPropagation(); // Prevent switching category
        try {
            const isJoined = joinedCommunities.includes(category);
            const endpoint = isJoined ? '/community/leave' : '/community/join';
            const { data } = await api.post(endpoint, { category });
            setJoinedCommunities(data.joinedCommunities);
        } catch (err) {
            console.error("Join/Leave failed", err);
            alert("Action failed");
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim() && !selectedFile) return;

        try {
            let mediaUrl = null;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('folder', 'community');

                const uploadRes = await api.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                mediaUrl = uploadRes.data.media.url;
            }

            const { data } = await api.post('/community', {
                content: newPostContent,
                category: activeCategory.name === 'All' ? 'General' : activeCategory.name,
                mediaUrl: mediaUrl,
                media: mediaUrl ? [{ type: 'image', url: mediaUrl }] : []
            });

            if (activeCategory.name === 'All' || activeCategory.name === data.post.category) {
                const newPost = {
                    ...data.post,
                    author: {
                        name: user.name || user.displayName || 'Me',
                        profilePicture: user.photoURL || user.profilePicture
                    }
                };
                setPosts([newPost, ...posts]);
            }
            setNewPostContent('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            console.error("Failed to create post", err);
            alert("Failed to post. Please try again.");
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleLike = async (postId) => {
        try {
            const { data } = await api.post(`/community/${postId}/like`);
            setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likesArray, isLiked: !p.isLiked } : p));
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    // Icons Wrappers


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] -m-6 lg:m-0 gap-6">

            {/* Mobile Category Toggle */}
            <div className="lg:hidden p-4 bg-white border-b flex justify-between items-center">
                <span className="font-bold text-gray-800">{activeCategory.name} Community</span>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 bg-gray-100 rounded-full">
                    {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* LEFT SIDEBAR - Categories */}
            <div className={`
                fixed inset-0 z-40 bg-white lg:static lg:block lg:w-64 lg:bg-transparent lg:z-auto transition-transform duration-300 transform 
                ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full bg-white lg:rounded-xl lg:shadow-sm lg:border p-4 overflow-y-auto">
                    <h3 className="font-bold text-gray-500 text-xs uppercase mb-4 px-2">Communities</h3>
                    <div className="space-y-1">
                        {communities.map(cat => {
                            const isJoined = joinedCommunities.includes(cat.name);
                            return (
                                <div key={cat.id} className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setActiveCategory(cat); setShowMobileMenu(false); }}
                                        className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory.name === cat.name ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <cat.icon size={18} />
                                        {cat.name}
                                    </button>
                                    {cat.name !== 'All' && (
                                        <button
                                            onClick={(e) => handleJoinToggle(cat.name, e)}
                                            className={`text-xs px-2 py-1 rounded border ${isJoined ? 'bg-green-50 text-green-600 border-green-100' : 'text-gray-400 border-gray-200 hover:border-gray-400'}`}
                                            title={isJoined ? "Leave" : "Join"}
                                        >
                                            {isJoined ? '✓' : '+'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8">
                        <h3 className="font-bold text-gray-500 text-xs uppercase mb-4 px-2">Online Members</h3>
                        <div className="space-y-3 px-2">
                            {onlineUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={u.avatar} className="w-8 h-8 rounded-full" alt={u.name} />
                                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${u.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    </div>
                                    <span className="text-sm text-gray-700 truncate">{u.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN FEED */}
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 px-4 lg:px-0 scrollbar-hide">
                {/* Create Post */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex gap-4">
                        <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" alt="Me" />
                        <div className="flex-1">
                            <form onSubmit={handleCreatePost}>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder={`Share something in ${activeCategory.name}...`}
                                    className="w-full bg-gray-50 border-0 rounded-lg p-3 focus:ring-1 focus:ring-orange-200 resize-none min-h-[80px]"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${selectedFile ? 'text-green-600 bg-green-50' : 'text-gray-500'}`}
                                        >
                                            <Image size={18} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                        {selectedFile && (
                                            <span className="text-xs text-gray-500 truncate max-w-[100px]">
                                                {selectedFile.name}
                                            </span>
                                        )}
                                        {selectedFile && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                        <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors hidden sm:block"><Users size={18} /></button>
                                    </div>
                                    <Button type="submit" disabled={!newPostContent.trim() && !selectedFile} className="bg-orange-600 text-white rounded-full px-6 py-1.5 text-sm">Post</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                        <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">No posts yet</h3>
                        <p className="text-gray-500">Be the first to share in {activeCategory.name}!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => {
                            const authorName = post.author?.name || post.User?.name || 'Anonymous';
                            const authorImage = post.author?.profilePicture || post.User?.profileImage || 'https://via.placeholder.com/40';

                            return (
                                <div key={post.id} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src={authorImage} className="w-10 h-10 rounded-full object-cover" alt={authorName} />
                                            <div>
                                                <h4 className="font-bold text-gray-900">{authorName}</h4>
                                                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
                                    </div>

                                    <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                                    {post.mediaUrl && (
                                        <div className="mb-4 rounded-lg overflow-hidden">
                                            <img src={post.mediaUrl} alt="Post content" className="w-full max-h-[400px] object-cover" />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
                                            >
                                                <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                                                {post.userHasLiked ? (post.likes || 0) + 1 : (post.likes || 0)}
                                            </button>
                                            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                                <MessageCircle size={18} />
                                                {post.comments?.length || 0}
                                            </button>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* RIGHT SIDEBAR - Suggestions (Hidden on mobile) */}
            <div className="hidden lg:block w-72 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-sm">Who to follow</h3>
                        <button className="text-xs text-orange-600 font-medium hover:underline">View all</button>
                    </div>
                    <div className="space-y-4">
                        {suggestions.map(s => (
                            <div key={s.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={s.avatar} className="w-9 h-9 rounded-full" alt={s.name} />
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm text-gray-900 truncate w-24">{s.name}</p>
                                        <p className="text-xs text-gray-500">{s.role}</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">Follow</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-5 text-white shadow-lg">
                    <h3 className="font-bold mb-2">Join Premium Groups</h3>
                    <p className="text-xs text-indigo-100 mb-4">Access exclusive content from top artists and instructors.</p>
                    <Button className="w-full bg-white text-indigo-900 font-bold text-sm py-2">Explore Premium</Button>
                </div>

                <div className="text-xs text-gray-400 text-center">
                    &copy; 2026 GauGyan Community • Privacy • Terms
                </div>
            </div>

        </div>
    );
};

export default CommunityFeed;
