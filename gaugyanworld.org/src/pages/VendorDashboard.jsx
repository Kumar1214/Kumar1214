import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutGrid, Package, ShoppingBag, DollarSign, Image, Users,
    Mic, Video, BookOpen, Settings, LogOut, Moon, Sun, Globe, MoreHorizontal,
    Plus, Search, Filter, Bell, Menu, X, ChevronRight, Upload, Calendar,
    BarChart3, Award, MessageSquare, Megaphone, Tag, Sparkles, Copy, Mail, MapPin, Phone, ShieldCheck, FileText, CheckCircle, AlertTriangle
} from 'lucide-react';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import WalletSection from '../components/dashboard/WalletSection';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import OnboardingWidget from '../components/dashboard/OnboardingWidget';
import AlertSection from '../components/dashboard/AlertSection';
import { useData } from '../context/useData';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { usePlugins } from '../context/PluginContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import InvoiceGenerator from '../components/common/InvoiceGenerator';

const VendorDashboard = () => {
    const { user } = useAuth();
    const { isPluginActive, loading: pluginsLoading } = usePlugins();
    // const { products, addProduct } = useData(); // Global products not sufficient for vendor view
    const [activeTab, setActiveTab] = useState('overview');
    const [showProductModal, setShowProductModal] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);

    if (pluginsLoading) return <div className="p-8 text-center">Checking vendor module...</div>;
    if (!isPluginActive('vendor')) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-full py-20 bg-gray-50 rounded-xl border border-gray-200">
                    <AlertTriangle size={48} className="text-orange-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Vendor Module Disabled</h2>
                    <p className="text-gray-500 mt-2">The marketplace functionality is currently disabled by the administrator.</p>
                </div>
            </DashboardLayout>
        );
    }

    // --- Verification ---
    const [verificationStatus, setVerificationStatus] = useState(null); // null, pending, approved, rejected
    const [verificationForm, setVerificationForm] = useState({
        aadharNumber: '', aadharCardUrl: '',
        panNumber: '', panCardUrl: '',
        gstNumber: '', gstCertificateUrl: ''
    });

    useEffect(() => {
        if (activeTab === 'verification') {
            fetchVerificationStatus();
        }
    }, [activeTab]);

    const fetchVerificationStatus = async () => {
        try {
            const { data } = await api.get('/verification/my-status');
            if (data.success && data.data) {
                setVerificationStatus(data.data);
            }
        } catch (error) {
            console.error("Verification status fetch failed");
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/verification', { ...verificationForm, type: 'vendor' });
            if (data.success) {
                alert("Verification request submitted!");
                fetchVerificationStatus();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Internal Error");
        }
    };

    const handleVerificationUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.url || (res.data.file && res.data.file.filename)) {
                const url = res.data.url || `/uploads/${res.data.file.filename}`;
                setVerificationForm(prev => ({ ...prev, [field]: url }));
                alert("File uploaded!");
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    // --- Promotions & AI ---
    const [coupons, setCoupons] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiFormData, setAiFormData] = useState({ product: '', goal: 'sale', tone: 'professional' });
    const [aiResult, setAiResult] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'promotions' && user) {
            fetchCoupons();
        }
    }, [activeTab, user]);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get('/coupons');
            if (data.success) setCoupons(data.data);
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        }
    };

    const handleAiGenerate = async () => {
        setAiLoading(true);
        try {
            const { data } = await api.post('/api/ai/generate-marketing-copy', aiFormData); // Note: server.js mounts it at /api/ai
            if (data.success) setAiResult(data.text);
        } catch (error) {
            console.error("AI Generation failed", error);
            setAiResult("Failed to generate copy. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleCreateCoupon = async (newCoupon) => {
        // Simple mock for now, ideally needs a form modal like Admin's
        try {
            const { data } = await api.post('/coupons', {
                code: `PROMO${Math.floor(Math.random() * 1000)}`,
                discount: 10,
                type: 'percentage',
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                usageLimit: 50,
                applicableTo: 'all'
            });
            if (data.success) {
                alert("Coupon created!"); // Changed from toast.success
                fetchCoupons();
            }
        } catch (e) {
            alert("Failed to create coupon"); // Changed from toast.error
        }
    };
    // Mock AI Generation
    const generateAIDescription = () => {
        if (!newProduct.name) return alert("Please enter a product name first.");
        setLoadingAI(true);
        // Simulate AI delay
        setTimeout(() => {
            setNewProduct(prev => ({
                ...prev,
                description: `Experience the premium quality of ${newProduct.name}. Handcrafted with precision and designed for elegance, this item brings a touch of luxury to your life. Made from ethically sourced materials, it ensures durability and style. Perfect for those who appreciate fine craftsmanship.`
            }));
            setLoadingAI(false);
        }, 1500);
    };

    // Local State
    const [myProducts, setMyProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [vendorOrders, setVendorOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Product Form State
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Other', description: '', image: '', gallery: [] });
    // Temporary states for file objects if we want to preview before upload, or just upload on submit
    // But for better UX, let's keep it simple: Upload images first via separate handler or auto-upload
    // Given the prompt asked to "add upload product images", let's use a file input that uploads immediately or on save.
    // For simplicity and to reuse our media library logic, we'll implement a helper to upload.

    const handleProductImageUpload = async (e, type = 'main') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        if (type === 'main') {
            formData.append('file', files[0]);
            try {
                const res = await api.post('/v1/content/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setNewProduct(prev => ({ ...prev, image: res.data.media.url }));
            } catch (err) {
                console.error("Main image upload failed", err);
                alert("Image upload failed");
            }
        } else {
            // Gallery
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            try {
                const res = await api.post('/v1/content/media/upload-multiple', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const newUrls = res.data.media.map(m => m.url);
                setNewProduct(prev => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }));
            } catch (err) {
                console.error("Gallery upload failed", err);
                alert("Gallery upload failed");
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Ensure we have an image
            if (!newProduct.image) {
                alert("Please upload a main product image.");
                return;
            }

            const response = await api.post('/products', {
                ...newProduct,
                // Backend expects 'images' array usually for gallery, or 'image' string for main.
                // Adjust based on your backend. Assuming 'images' is the gallery + main or just gallery.
                // Let's pass both if backend supports. If backend only has 'image' and 'images' (array):
                images: newProduct.gallery,
                vendorId: user.id
            });

            if (response.data.success) {
                setMyProducts([...myProducts, response.data.data]);
                setShowProductModal(false);
                setNewProduct({ name: '', price: '', stock: '', category: 'Other', description: '', image: '', gallery: [] });
                alert("Product added successfully!");
            }
        } catch (err) {
            console.error("Add Product Failed", err);
            alert("Failed to add product");
        }
    };

    // Fetch My Products
    useEffect(() => {
        const fetchMyProducts = async () => {
            if (!user?.id) return;
            try {
                setLoadingProducts(true);
                setLoadingProducts(true);
                // Fetch all statuses for the vendor via plugin API
                const { data } = await api.getVendorProducts();
                // Plugin endpoint returns filtered products for current vendor
                setMyProducts(data.data || []);
            } catch (err) {
                console.error("Failed to fetch my products:", err);
            } finally {
                setLoadingProducts(false);
            }
        };

        if (activeTab === 'products' || activeTab === 'overview') {
            fetchMyProducts();
        }
    }, [user, activeTab]);

    // Fetch Vendor Orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoadingOrders(true);
                setLoadingOrders(true);
                const { data } = await api.getVendorOrders();
                setVendorOrders(data.data || []);
            } catch (err) {
                console.error("Failed to fetch vendor orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };
        // Only fetch if tab is active or just initially
        if (activeTab === 'orders' || activeTab === 'overview' || activeTab === 'finances') {
            fetchOrders();
        }
    }, [activeTab]);

    // Derived Data
    // myProducts is now state, not derived from global

    const lowStockProducts = myProducts.filter(p => p.stock < 10);

    const analytics = useMemo(() => {
        const totalSales = vendorOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);
        const totalOrders = vendorOrders.length;

        // Group by day for chart
        const dailyData = {};
        vendorOrders.forEach(o => {
            const date = new Date(o.createdAt).toLocaleDateString();
            dailyData[date] = (dailyData[date] || 0) + parseFloat(o.totalPrice || 0);
        });
        const chartData = Object.keys(dailyData).map(d => ({ date: d, sales: dailyData[d] })).slice(-7); // Last 7 entries

        return { totalSales, totalOrders, chartData };
    }, [vendorOrders]);

    // Handlers
    // Vendor Details State
    const [vendorDetails, setVendorDetails] = useState({
        shopName: '',
        gstNumber: '',
        panNumber: '',
        pickupAddress: '',
        description: '',
        storeLogo: ''
    });


    // Vendor Profile State
    const [vendorProfile, setVendorProfile] = useState({
        displayName: '',
        phone: '',
        bio: '',
        profilePicture: ''
    });



    // Parse vendor details from user data
    useEffect(() => {
        if (user) {
            // Set initial profile from user object
            setVendorProfile({
                displayName: user.displayName || user.name || '',
                phone: user.phoneNumber || '', // If available in top level
                bio: '' // Will be overwritten if found in detail
            });

            if (user.detail) {
                try {
                    const parsed = JSON.parse(user.detail);
                    setVendorDetails({
                        shopName: parsed.shopName || '',
                        gstNumber: parsed.gstNumber || '',
                        panNumber: parsed.panNumber || '',
                        pickupAddress: parsed.pickupAddress || '',
                        description: parsed.description || '',
                        storeLogo: parsed.storeLogo || ''
                    });
                    // Also parse specific profile fields if they exist in detail
                    setVendorProfile(prev => ({
                        ...prev,
                        phone: parsed.phone || prev.phone,
                        bio: parsed.bio || prev.bio,
                        profilePicture: parsed.profilePicture || user.photoURL || '',
                        // If we stored displayName in detail, restore it, otherwise keep user.displayName
                        displayName: parsed.displayName || prev.displayName
                    }));


                } catch (e) {
                    console.error("Error parsing vendor details", e);
                }
            }
        }
    }, [user]);


    const handleLogoUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/v1/content/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.media.url;

            if (type === 'profile') {
                setVendorProfile(prev => ({ ...prev, profilePicture: url }));
            } else {
                setVendorDetails(prev => ({ ...prev, storeLogo: url }));
            }
        } catch (err) {
            console.error("Image upload failed", err);
            alert("Image upload failed");
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            // Merge profile and shop details into one JSON object for storage
            const combinedDetails = {
                ...vendorDetails,
                ...vendorProfile, // store profile in detail as well
            };
            const detailString = JSON.stringify(combinedDetails);

            // Update user profile
            await api.put('/v1/auth/profile', {
                detail: detailString,
                displayName: vendorProfile.displayName,
                profilePicture: vendorProfile.profilePicture
                // phoneNumber: vendorProfile.phone // Update if backend supports it
            });

            alert("Settings saved successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Save settings failed", error);
            alert("Failed to save settings");
        }
    };

    // Media Library State
    const [mediaItems, setMediaItems] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch Media
    useEffect(() => {
        if (activeTab === 'media') {
            const fetchMedia = async () => {
                try {
                    setLoadingMedia(true);
                    const res = await api.get('/v1/content/media'); // Check prefix in api util, assuming /media mapped
                    setMediaItems(res.data.media || []);
                } catch (e) {
                    console.error("Fetch media failed", e);
                } finally {
                    setLoadingMedia(false);
                }
            };
            fetchMedia();
        }
    }, [activeTab]);

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        // Support multiple
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            // Determine endpoint based on single vs multiple
            const endpoint = files.length > 1 ? '/v1/content/media/upload-multiple' : '/v1/content/media/upload';
            // Adjust FormData key if single
            if (files.length === 1) {
                formData.delete('files');
                formData.append('file', files[0]);
            }

            const res = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-type' }
            });

            alert("Upload successful!");
            // Refresh
            const refreshRes = await api.get('/v1/content/media');
            setMediaItems(refreshRes.data.media || []);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed: " + (err.response?.data?.error || err.message));
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        alert("Copied URL: " + url);
    };

    const onboardingTasks = [
        {
            label: 'Verify Business Identity',
            description: 'Upload GST & PAN documents',
            completed: !!(vendorDetails.gstNumber && vendorDetails.panNumber),
            onClick: () => setActiveTab('settings')
        },
        {
            label: 'List First Product',
            description: 'Add details & images',
            completed: myProducts.length > 0,
            onClick: () => { setActiveTab('products'); setShowProductModal(true); }
        },
        {
            label: 'Configure Shipping',
            description: 'Set delivery zones & rates',
            completed: !!vendorDetails.pickupAddress,
            onClick: () => setActiveTab('settings')
        },
        {
            label: 'Receiving Orders',
            description: 'First order received',
            completed: vendorOrders.length > 0,
            onClick: () => setActiveTab('orders')
        },
    ];

    const alerts = [
        ...lowStockProducts.map(p => ({
            type: 'urgent', title: 'Low Stock', message: `${p.name} has only ${p.stock} left.`, time: 'Now', action: 'Restock'
        })),
        { type: 'info', title: 'Marketplace Tips', message: 'Add detailed descriptions to boost SEO.', time: '2d ago', action: 'Read' }
    ];

    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutGrid, onClick: () => setActiveTab('overview') },
        { path: '#products', label: 'Products', icon: Package, onClick: () => setActiveTab('products') },
        { path: '#orders', label: 'Orders', icon: ShoppingBag, onClick: () => setActiveTab('orders') },
        { path: '#finances', label: 'Finances', icon: DollarSign, onClick: () => setActiveTab('finances') },
        { path: '#media', label: 'Media Library', icon: Image, onClick: () => setActiveTab('media') },
        { path: '#wallet', label: 'Wallet', icon: WalletSection, onClick: () => setActiveTab('wallet') }, // Fixed icon
        { path: '#community', label: 'Community', icon: Users, onClick: () => setActiveTab('community') },
        { path: '#promotions', label: 'Promotions', icon: Megaphone, onClick: () => setActiveTab('promotions') },
        { path: '#notifications', label: 'Notifications', icon: Bell, onClick: () => setActiveTab('notifications') },
        { path: '#settings', label: 'Shop Settings', icon: MoreHorizontal, onClick: () => setActiveTab('settings') },
    ];

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Vendor Center"
            title={activeTab === 'settings' ? 'Shop Settings' : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
        >
            <div className="relative">
                {/* Header Action */}
                <div className="absolute top-0 right-0 -mt-16 hidden lg:flex gap-2">
                    <Button
                        onClick={() => window.open('/shop/preview', '_blank')}
                        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg"
                    >
                        <Settings size={18} /> View Shop
                    </Button>
                    {activeTab === 'media' && (
                        <div className="relative">
                            <input type="file" multiple onChange={handleFileUpload} className="hidden" id="media-upload" />
                            <label htmlFor="media-upload" className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Media'}
                            </label>
                        </div>
                    )}
                    {activeTab === 'products' && (
                        <Button
                            onClick={() => setShowProductModal(true)}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-colors border-none"
                        >
                            <Plus size={18} /> Add Product
                        </Button>
                    )}
                    {activeTab === 'promotions' && (
                        <Button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-lg border-none">
                            <Plus size={18} /> Create Campaign
                        </Button>
                    )}
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <AlertSection alerts={alerts} />

                                    {/* Analytics Card */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
                                                <p className="text-gray-500 text-sm">Last 7 active days</p>
                                            </div>
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <DollarSign size={14} /> ₹{analytics.totalSales} Total
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analytics.chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} prefix="₹" />
                                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                                    <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <OnboardingWidget
                                        title="Seller Setup"
                                        tasks={onboardingTasks}
                                        completedCount={onboardingTasks.filter(t => t.completed).length}
                                    />
                                    {/* Inventory Summary */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory Health</h3>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-gray-600">Total Products</span>
                                            <span className="font-bold text-gray-900">{myProducts.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-gray-600">Low Stock</span>
                                            <span className="font-bold text-red-600">{lowStockProducts.length}</span>
                                        </div>
                                        <Button className="w-full mt-4" onClick={() => setActiveTab('products')}>Manage Stock</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'wallet' && <WalletSection />}
                    {activeTab === 'community' && <CommunityFeed />}

                    {activeTab === 'media' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {loadingMedia ? <p>Loading...</p> : mediaItems.length === 0 ? <p className="col-span-full text-center text-gray-500 py-10">No media found. Upload some!</p> : (
                                mediaItems.map(item => (
                                    <div key={item.id} className="group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {item.mimeType.startsWith('image/') ? (
                                                <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                                            ) : (
                                                <FileText size={40} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="p-2 text-xs truncate font-medium text-gray-700">{item.originalName || item.filename}</div>
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                            <button onClick={() => copyToClipboard(item.url)} className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600" title="Copy URL"><Copy size={16} /></button>
                                            <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50" title="Delete"><Settings size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                                </div>
                                <Button className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200 border-none"><Filter size={18} /> Filter</Button>
                                <Button className="bg-orange-600 text-white lg:hidden" onClick={() => setShowProductModal(true)}><Plus size={18} /></Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {myProducts.length === 0 ? (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products found. Add one!</td></tr>
                                        ) : (
                                            myProducts.map(p => (
                                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {/* Handle image array or string */}
                                                            <img src={Array.isArray(p.images) ? p.images[0] : p.image || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                                            <span className="font-medium text-gray-900">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-700">₹{p.price}</td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {p.stock < 10 ? <span className="text-red-500 font-bold">{p.stock}</span> : p.stock}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {p.stock > 0 ? 'Active' : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <h3 className="p-4 text-lg font-bold border-b border-gray-100">Orders History</h3>
                            {loadingOrders ? (
                                <div className="p-8 text-center">Loading orders...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Total</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {vendorOrders.length === 0 ? (
                                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders yet.</td></tr>
                                            ) : (
                                                vendorOrders.map(o => (
                                                    <tr key={o.id} className="hover:bg-gray-50/50">
                                                        <td className="px-6 py-4 font-mono text-sm">#{o.id}</td>
                                                        <td className="px-6 py-4 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-sm">{o.user?.name || 'Guest'}</td>
                                                        <td className="px-6 py-4 font-bold">₹{o.totalPrice}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold uppercase">{o.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <InvoiceGenerator order={o} type="button" />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'finances' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Payouts</h3>
                                <div className="text-3xl font-extrabold text-gray-900 mb-1">₹{(analytics.totalSales * 0.9).toFixed(2)}</div>
                                <p className="text-gray-500 text-sm">Available for withdrawal (after 10% commission)</p>
                                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">Request Payout</Button>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Sales Trend</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analytics.chartData}>
                                            <XAxis dataKey="date" hide />
                                            <YAxis hide />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verification' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-blue-600" /> Identity Verification
                            </h2>

                            {verificationStatus ? (
                                <div className={`p-6 rounded-xl border ${verificationStatus.status === 'approved' ? 'bg-green-50 border-green-200' :
                                    verificationStatus.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                        'bg-yellow-50 border-yellow-200'
                                    }`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        {verificationStatus.status === 'approved' && <CheckCircle className="text-green-600 h-10 w-10" />}
                                        {verificationStatus.status === 'rejected' && <AlertTriangle className="text-red-600 h-10 w-10" />}
                                        {verificationStatus.status === 'pending' && <Clock className="text-yellow-600 h-10 w-10" />}

                                        <div>
                                            <h3 className="text-lg font-bold capitalize">{verificationStatus.status}</h3>
                                            <p className="text-sm opacity-80">Submitted on {new Date(verificationStatus.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {verificationStatus.adminComments && (
                                        <div className="bg-white/50 p-4 rounded-lg">
                                            <strong>Admin Note:</strong> {verificationStatus.adminComments}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                    <p className="mb-6 text-gray-600">Please provide your official documents to become a verified vendor. This helps build trust with our customers.</p>

                                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Aadhar */}
                                            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                                <h4 className="font-bold mb-3 flex items-center gap-2"><FileText size={16} /> Aadhar Card</h4>
                                                <input
                                                    className="w-full mb-3 p-2 border rounded"
                                                    placeholder="Aadhar Number"
                                                    value={verificationForm.aadharNumber}
                                                    onChange={e => setVerificationForm({ ...verificationForm, aadharNumber: e.target.value })}
                                                    required
                                                />
                                                {/* GST Input */}
                                                <h4 className="font-bold mb-3 mt-4 flex items-center gap-2"> GSTIN (Optional)</h4>
                                                <input
                                                    className="w-full mb-3 p-2 border rounded"
                                                    placeholder="GST Number"
                                                    value={vendorDetails.gstNumber}
                                                    onChange={e => setVendorDetails({ ...vendorDetails, gstNumber: e.target.value })}
                                                />
                                                <input
                                                    className="w-full mb-3 p-2 border rounded"
                                                    placeholder="Legal Shop Name"
                                                    value={vendorDetails.shopName}
                                                    onChange={e => setVendorDetails({ ...vendorDetails, shopName: e.target.value })}
                                                />
                                                <input type="file" onChange={e => handleVerificationUpload(e, 'aadharCardUrl')} className="text-sm" required />
                                                {verificationForm.aadharCardUrl && <div className="text-xs text-green-600 mt-1">File Uploaded ✓</div>}
                                            </div>

                                            {/* PAN */}
                                            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                                                <h4 className="font-bold mb-3 flex items-center gap-2"><FileText size={16} /> PAN Card</h4>
                                                <input
                                                    className="w-full mb-3 p-2 border rounded"
                                                    placeholder="PAN Number"
                                                    value={verificationForm.panNumber}
                                                    onChange={e => setVerificationForm({ ...verificationForm, panNumber: e.target.value })}
                                                    required
                                                />
                                                <input type="file" onChange={e => handleVerificationUpload(e, 'panCardUrl')} className="text-sm" required />
                                                {verificationForm.panCardUrl && <div className="text-xs text-green-600 mt-1">File Uploaded ✓</div>}
                                            </div>

                                            {/* GST */}
                                            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 md:col-span-2">
                                                <h4 className="font-bold mb-3 flex items-center gap-2"><FileText size={16} /> GST Certificate (Optional)</h4>
                                                <input
                                                    className="w-full mb-3 p-2 border rounded"
                                                    placeholder="GST Number"
                                                    value={verificationForm.gstNumber}
                                                    onChange={e => setVerificationForm({ ...verificationForm, gstNumber: e.target.value })}
                                                />
                                                <input type="file" onChange={e => handleVerificationUpload(e, 'gstCertificateUrl')} className="text-sm" />
                                                {verificationForm.gstCertificateUrl && <div className="text-xs text-green-600 mt-1">File Uploaded ✓</div>}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full md:w-auto bg-[#EA580C] hover:bg-[#c2410c] text-white px-8">
                                                Submit for Verification
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'promotions' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Create Campaign Card */}
                                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white text-center flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-bold mb-2">Run a Flash Sale</h3>
                                    <p className="mb-4 opacity-90">Boost visibility by creating a limited-time coupon.</p>
                                    <Button onClick={handleCreateCoupon} className="bg-white text-pink-600 hover:bg-gray-100 border-none">
                                        Create Quick Sale (10% Off)
                                    </Button>
                                </div>

                                {/* Active Coupons List */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-800">Active Coupons</h3>
                                        <Tag size={18} className="text-gray-400" />
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {coupons.length === 0 ? <p className="text-sm text-gray-500">No active coupons.</p> : coupons.map(coupon => (
                                            <div key={coupon.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div>
                                                    <div className="font-mono font-bold text-gray-800">{coupon.code}</div>
                                                    <div className="text-xs text-gray-500">{new Date(coupon.validUntil).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-green-600 font-bold text-sm">
                                                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Assistant Card */}
                                <div className="lg:col-span-2 bg-indigo-900 rounded-xl p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div className="max-w-md">
                                            <h3 className="text-2xl font-bold mb-2">AI Marketing Assistant</h3>
                                            <p className="opacity-80 mb-6">Let our AI generate high-converting ad copy for your products.</p>
                                            <Button onClick={() => setShowAiModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white border-none px-6">
                                                Try Beta
                                            </Button>
                                        </div>
                                        <Sparkles size={100} className="text-indigo-800 opacity-50 absolute right-8 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && <NotificationCenter />}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Shop Settings & Compliance</h3>
                            <form onSubmit={handleSaveSettings} className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Personal Profile</h4>

                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            {vendorProfile.profilePicture ? (
                                                <img src={vendorProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users size={32} className="text-gray-400" />
                                            )}
                                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold">
                                                Change
                                                <input type="file" onChange={(e) => handleLogoUpload(e, 'profile')} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <p className="font-bold text-gray-700">Profile Photo</p>
                                            <p>Upload a professional photo.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                            <input
                                                type="text"
                                                value={vendorProfile.displayName}
                                                onChange={e => setVendorProfile({ ...vendorProfile, displayName: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                value={vendorProfile.phone}
                                                onChange={e => setVendorProfile({ ...vendorProfile, phone: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="+91..."
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                                            <textarea
                                                value={vendorProfile.bio}
                                                onChange={e => setVendorProfile({ ...vendorProfile, bio: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none h-20"
                                                placeholder="Brief introduction..."
                                            />
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Store Setup</h4>

                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="relative group w-32 h-20 rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            {vendorDetails.storeLogo ? (
                                                <img src={vendorDetails.storeLogo} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">Store Logo</span>
                                            )}
                                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold">
                                                Upload
                                                <input type="file" onChange={(e) => handleLogoUpload(e, 'store')} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <p className="font-bold text-gray-700">Store Logo</p>
                                            <p>Recommended size: 300x150px</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                                        <input
                                            type="text"
                                            value={vendorDetails.shopName}
                                            onChange={e => setVendorDetails({ ...vendorDetails, shopName: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                            placeholder="e.g. Royal Artifacts"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                        <input
                                            type="text"
                                            value={vendorDetails.gstNumber}
                                            onChange={e => setVendorDetails({ ...vendorDetails, gstNumber: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                            placeholder="GSTIN..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                        <input
                                            type="text"
                                            value={vendorDetails.panNumber}
                                            onChange={e => setVendorDetails({ ...vendorDetails, panNumber: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                            placeholder="PAN..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                                    <textarea
                                        value={vendorDetails.pickupAddress}
                                        onChange={e => setVendorDetails({ ...vendorDetails, pickupAddress: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none h-24"
                                        placeholder="Full address for courier pickup..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                                    <textarea
                                        value={vendorDetails.description}
                                        onChange={e => setVendorDetails({ ...vendorDetails, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none h-20"
                                        placeholder="Tell customers about your shop..."
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" className="bg-orange-600 text-white w-full">Save Settings</Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" className="w-full border p-2 rounded" required />
                            <div className="flex gap-4">
                                <input value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price (₹)" type="number" className="flex-1 border p-2 rounded" required />
                                <input value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Stock Qty" type="number" className="flex-1 border p-2 rounded" required />
                            </div>


                            {/* Main Image */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        value={newProduct.image}
                                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                        placeholder="Image URL"
                                        className="flex-1 border p-2 rounded"
                                    />
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded border flex items-center justify-center">
                                        <Upload size={18} />
                                        <input type="file" onChange={(e) => handleProductImageUpload(e, 'main')} accept="image/*" className="hidden" />
                                    </label>
                                </div>
                                {newProduct.image && (
                                    <img src={newProduct.image} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                                )}
                            </div>

                            {/* Gallery */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                                <div className="flex gap-2 items-center">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded border flex items-center gap-2 text-sm font-medium">
                                        <Upload size={16} /> Upload Gallery
                                        <input type="file" multiple onChange={(e) => handleProductImageUpload(e, 'gallery')} accept="image/*" className="hidden" />
                                    </label>
                                    <span className="text-xs text-gray-400">{newProduct.gallery.length} images selected</span>
                                </div>

                                {newProduct.gallery.length > 0 && (
                                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                        {newProduct.gallery.map((url, idx) => (
                                            <div key={idx} className="relative flex-shrink-0">
                                                <img src={url} alt={`Gallery ${idx}`} className="h-16 w-16 object-cover rounded border" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProduct(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Detailed product description..."
                                    className="w-full border p-2 rounded h-24"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateAIDescription}
                                    disabled={loadingAI}
                                    className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                >
                                    <Sparkles size={12} />
                                    {loadingAI ? 'Generating...' : 'AI Generate'}
                                </button>
                            </div>

                            <div className="flex gap-3 justify-end mt-4">
                                <Button type="button" onClick={() => setShowProductModal(false)} className="!bg-gray-100 !text-gray-700">Cancel</Button>
                                <Button type="submit" className="bg-orange-600 text-white">Create Product</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default VendorDashboard;
