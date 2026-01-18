import React, { useState, useEffect, useMemo } from 'react';
import { Home, Image as ImageIcon, Gift, Settings, Plus, Edit, Trash2, MapPin, Heart, Package, ShoppingBag, LayoutDashboard, Leaf, Users, X, Upload, Camera, Search, Filter, DollarSign, TrendingUp, MoreVertical, Globe, Wallet } from 'lucide-react';
import WalletSection from '../components/dashboard/WalletSection';
import CommunityFeed from '../components/dashboard/CommunityFeed';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardLayout from '../layout/DashboardLayout';
import Button from '../components/Button';
import OnboardingWidget from '../components/dashboard/OnboardingWidget';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import InvoiceGenerator from '../components/common/InvoiceGenerator';

const GaushalaOwnerDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [myGaushala, setMyGaushala] = useState(null);
    const [cows, setCows] = useState([]);
    const [donations, setDonations] = useState([]); // Mock for now or fetch
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // E-commerce States
    const [myProducts, setMyProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Gaushala Product', description: '', image: 'https://images.unsplash.com/photo-1586769852044-692d6e37e745?auto=format&fit=crop&q=80&w=300' });

    // Modal States
    const [showCowModal, setShowCowModal] = useState(false);
    const [cowForm, setCowForm] = useState({ name: '', breed: '', age: '', description: '', adoptionStatus: 'Available', monthlyCost: '' });
    const [editingCow, setEditingCow] = useState(null);

    // Fetch Initial Data (Gaushala Profile & Orders)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Fetch My Gaushala Profile
                const { data: gaushalaData } = await api.get(`/gaushalas?ownerId=${user.id}`);
                const myProfile = gaushalaData.data && gaushalaData.data.length > 0 ? gaushalaData.data[0] : null;
                setMyGaushala(myProfile);

                if (myProfile) {
                    // 2. Fetch Cows for this Gaushala
                    const { data: cowData } = await api.get(`/cows/gaushala/${myProfile.id}`);
                    setCows(cowData && Array.isArray(cowData) ? cowData : cowData.data || []);
                }

                // 3. Fetch Orders (as Vendor)
                const { data: orderData } = await api.get('/orders/vendor-orders');
                setOrders(orderData);

                // 4. Fetch My Products
                const { data: productsData } = await api.get(`/products?vendor=${user.id}&status=all`);
                setMyProducts(productsData.data || []);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchInitialData();
    }, [user]);

    // Cow CRUD
    const handleSaveCow = async (e) => {
        e.preventDefault();
        try {
            if (!myGaushala) {
                alert("Please create a Gaushala profile first in Settings.");
                return;
            }

            const payload = { ...cowForm, gaushalaId: myGaushala.id };

            if (editingCow) {
                const { data } = await api.put(`/cows/${editingCow.id}`, payload);
                setCows(cows.map(c => c.id === data.data.id ? data.data : c));
            } else {
                const { data } = await api.post('/cows', payload);
                setCows([data.data, ...cows]);
            }
            setShowCowModal(false);
            setCowForm({ name: '', breed: '', age: '', description: '', adoptionStatus: 'Available', monthlyCost: '' });
            setEditingCow(null);
        } catch (err) {
            console.error("Save Cow Error:", err);
            alert("Failed to save cow details.");
        }
    };

    const handleDeleteCow = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/cows/${id}`);
            setCows(cows.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete cow.");
        }
    };

    const handleEditClick = (cow) => {
        setEditingCow(cow);
        setCowForm({
            name: cow.name,
            breed: cow.breed,
            age: cow.age,
            description: cow.description,
            adoptionStatus: cow.adoptionStatus,
            monthlyCost: cow.monthlyCost || ''
        });
        setShowCowModal(true);
    };

    // Product CRUD
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/products', {
                ...newProduct,
                vendorId: user.id
            });

            if (response.data.success) {
                setMyProducts([...myProducts, response.data.data]);
                setShowProductModal(false);
                setNewProduct({ name: '', price: '', stock: '', category: 'Gaushala Product', description: '', image: 'https://images.unsplash.com/photo-1586769852044-692d6e37e745?auto=format&fit=crop&q=80&w=300' });
                alert("Product added successfully!");
            }
        } catch (err) {
            console.error("Add Product Failed", err);
            alert("Failed to add product");
        }
    };


    // Stats
    // Stats & Analytics
    const analytics = useMemo(() => {
        const totalCows = cows.length;
        const adoptedCows = cows.filter(c => c.adoptionStatus === 'Adopted').length;
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);

        // Group by day for chart
        const dailyData = {};
        orders.forEach(o => {
            const date = new Date(o.createdAt).toLocaleDateString();
            dailyData[date] = (dailyData[date] || 0) + parseFloat(o.totalPrice || 0);
        });
        const chartData = Object.keys(dailyData).map(d => ({ date: d, sales: dailyData[d] })).slice(-7);

        return { totalCows, adoptedCows, totalOrders, totalSales, chartData };
    }, [cows, orders]);


    // Navigation
    const menuItems = [
        { path: '#overview', label: 'Overview', icon: LayoutDashboard, onClick: () => setActiveTab('overview') },
        { path: '#cows', label: 'My Cows', icon: Heart, onClick: () => setActiveTab('cows') },
        { path: '#products', label: 'My Products', icon: Package, onClick: () => setActiveTab('products') },
        { path: '#orders', label: 'Orders', icon: ShoppingBag, onClick: () => setActiveTab('orders') },
        { path: '#finances', label: 'Finances', icon: DollarSign, onClick: () => setActiveTab('finances') },
        { path: '#donations', label: 'Donations', icon: Gift, onClick: () => setActiveTab('donations') },
        { path: '#gallery', label: 'Gallery', icon: ImageIcon, onClick: () => setActiveTab('gallery') },
        { path: '#settings', label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
    ];

    if (loading) return <DashboardLayout menuItems={menuItems} sidebarTitle="Gaushala Admin" title="Loading..."><div className="p-8">Loading...</div></DashboardLayout>;

    return (
        <DashboardLayout
            menuItems={menuItems}
            sidebarTitle="Gaushala Admin"
            title={activeTab === 'profile' ? 'Gaushala Profile' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            subtitle="Manage your Gaushala, cows, and donations."
        >
            <div className="space-y-6">
                {!myGaushala && (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-orange-800 mb-4 flex items-center justify-between">
                        <span>⚠️ You haven't registered your Gaushala yet. Go to Settings to create your profile.</span>
                        <Button onClick={() => setActiveTab('settings')} className="bg-orange-600 text-white text-sm">Create Profile</Button>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-gray-500 text-sm">Total Cows</span>
                                <div className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalCows}</div>
                                <div className="text-xs text-gray-400 font-medium mt-1">{analytics.adoptedCows} adopted</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-gray-500 text-sm">Product Orders</span>
                                <div className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalOrders}</div>
                                <div className="text-xs text-green-600 font-medium mt-1">Pending Shipment</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-gray-500 text-sm">Total Sales</span>
                                <div className="text-2xl font-bold text-gray-900 mt-1">₹{analytics.totalSales}</div>
                            </div>
                        </div>

                        {/* Recent Activity / Cow Health */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Adoption Status</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-green-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-green-700">{analytics.adoptedCows}</div>
                                    <div className="text-sm text-green-800">Adopted</div>
                                </div>
                                <div className="flex-1 bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-700">{analytics.totalCows - analytics.adoptedCows}</div>
                                    <div className="text-sm text-blue-800">Available for Adoption</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cows' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">My Cows</h3>
                            <Button onClick={() => { setEditingCow(null); setShowCowModal(true); }} className="bg-orange-600 text-white flex items-center gap-2"><Plus size={16} /> Add Cow</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {cows.length === 0 ? <p className="col-span-3 text-center text-gray-500">No cows listed yet.</p> : cows.map(cow => (
                                <div key={cow.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="h-48 bg-gray-100 relative">
                                        {/* Placeholder Image */}
                                        <img src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=400" alt={cow.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(cow)} className="bg-white p-2 rounded-full shadow hover:bg-gray-50"><Edit size={14} /></button>
                                            <button onClick={() => handleDeleteCow(cow.id)} className="bg-white p-2 rounded-full shadow hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                                        </div>
                                        <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold ${cow.adoptionStatus === 'Adopted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {cow.adoptionStatus}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-gray-900">{cow.name}</h4>
                                        <p className="text-sm text-gray-500">{cow.breed} • {cow.age} yrs</p>
                                        <div className="mt-3 flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Cost: ₹{cow.monthlyCost}/mo</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">My Products</h3>
                            <Button onClick={() => setShowProductModal(true)} className="bg-orange-600 text-white flex items-center gap-2">
                                <Plus size={16} /> Add Product
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
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
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No products listed. Add your first product to start selling!</td></tr>
                                    ) : (
                                        myProducts.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
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
                                                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                        <h3 className="font-bold text-lg mb-4">Product Orders</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
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
                                    {orders.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No orders yet</td></tr> : orders.map(o => (
                                        <tr key={o.id}>
                                            <td className="px-6 py-4">#{o.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm">{o.user?.name || 'Guest'}</td>
                                            <td className="px-6 py-4 font-bold">₹{o.totalPrice}</td>
                                            <td className="px-6 py-4 uppercase text-xs font-bold">
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">{o.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <InvoiceGenerator order={o} type="button" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

                {activeTab === 'donations' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                        <Gift size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">Donations Module</h3>
                        <p className="text-gray-500">View history of donors appearing here soon.</p>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg mb-4">Gaushala Gallery</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600 font-medium">Click to upload photos</p>
                            <p className="text-xs text-gray-400 mt-1">Showcase your cows and facilities</p>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'community' && <CommunityFeed />}
                {activeTab === 'wallet' && <WalletSection />}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                        <h3 className="font-bold text-lg mb-6">Gaushala Settings</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gaushala Name</label>
                                <input type="text" className="w-full border p-2 rounded-lg" defaultValue={myGaushala?.name} placeholder="Enter name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location / City</label>
                                <input type="text" className="w-full border p-2 rounded-lg" defaultValue={myGaushala?.city} placeholder="City, State" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border p-2 rounded-lg h-24" defaultValue={myGaushala?.description} placeholder="Describe your mission..." />
                            </div>
                            <Button className="bg-green-600 text-white">Save Changes</Button>
                        </form>
                    </div>
                )}
            </div>

            {/* Cow Modal */}
            {showCowModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingCow ? 'Edit Cow' : 'Add New Cow'}</h3>
                            <button onClick={() => setShowCowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveCow} className="space-y-4">
                            <input value={cowForm.name} onChange={e => setCowForm({ ...cowForm, name: e.target.value })} placeholder="Cow Name / ID" required className="w-full border p-2 rounded" />
                            <div className="flex gap-4">
                                <input value={cowForm.breed} onChange={e => setCowForm({ ...cowForm, breed: e.target.value })} placeholder="Breed (e.g. Gir)" required className="flex-1 border p-2 rounded" />
                                <input value={cowForm.age} onChange={e => setCowForm({ ...cowForm, age: e.target.value })} placeholder="Age" type="number" required className="flex-1 border p-2 rounded" />
                            </div>
                            <input value={cowForm.monthlyCost} onChange={e => setCowForm({ ...cowForm, monthlyCost: e.target.value })} placeholder="Monthly Seva Cost (₹)" type="number" className="w-full border p-2 rounded" />
                            <select value={cowForm.adoptionStatus} onChange={e => setCowForm({ ...cowForm, adoptionStatus: e.target.value })} className="w-full border p-2 rounded">
                                <option value="Available">Available for Adoption</option>
                                <option value="Adopted">Adopted</option>
                                <option value="Perpetual Seva">Under Perpetual Seva</option>
                            </select>
                            <textarea value={cowForm.description} onChange={e => setCowForm({ ...cowForm, description: e.target.value })} placeholder="Description / History" className="w-full border p-2 rounded" />
                            <Button type="submit" className="w-full bg-orange-600 text-white">{editingCow ? 'Update Cow' : 'Add Cow'}</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                            <button onClick={() => setShowProductModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" className="w-full border p-2 rounded" required />
                            <div className="flex gap-4">
                                <input value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price (₹)" type="number" className="flex-1 border p-2 rounded" required />
                                <input value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Stock Qty" type="number" className="flex-1 border p-2 rounded" required />
                            </div>
                            <input value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} placeholder="Image URL" className="w-full border p-2 rounded" />
                            <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" className="w-full border p-2 rounded" required />

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

export default GaushalaOwnerDashboard;
