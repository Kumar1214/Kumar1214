import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShoppingBag, Star, Mail, Phone, MapPin, Grid, List, Search, Filter } from 'lucide-react';
import Button from '../components/Button';

const ShopPreview = () => {
    const { user } = useAuth();
    const [shopData, setShopData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopData = async () => {
            if (!user) return;
            try {
                // Fetch Vendor Details
                let details = {};
                if (user.detail) {
                    try {
                        const parsed = JSON.parse(user.detail);
                        details = parsed;
                    } catch (e) {
                        console.error("Parse error", e);
                    }
                }

                // Fallback to user data if some details missing
                const shopInfo = {
                    name: details.shopName || user.displayName || 'My Awesome Shop',
                    description: details.description || 'Welcome to our premium store. We offer high-quality products directly from the source.',
                    logo: details.storeLogo || user.photoURL || 'https://via.placeholder.com/150',
                    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=400&fit=crop&q=80', // Default placeholder banner
                    location: details.pickupAddress || 'India',
                    email: user.email,
                    phone: details.phone || user.phoneNumber || 'Contact for details'
                };
                setShopData(shopInfo);

                // Fetch Products
                const { data } = await api.get(`/products?vendor=${user.id}`);
                setProducts(data.data || []);

            } catch (err) {
                console.error("Failed to load shop", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchShopData();
    }, [user]);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;

    if (!shopData) return <div className="text-center p-10">Shop not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Banner Area */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden bg-gray-900">
                <img src={shopData.banner} alt="Shop Banner" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>

            {/* Shop Header Info */}
            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-md border-4 border-white overflow-hidden flex-shrink-0">
                        <img src={shopData.logo} alt={shopData.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 pt-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{shopData.name}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {shopData.location}</span>
                                    <span className="flex items-center gap-1"><Mail size={16} /> {shopData.email}</span>
                                    <span className="flex items-center gap-1"><Phone size={16} /> {shopData.phone}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex gap-3">
                                <Button className="bg-orange-600 text-white px-6">Follow Shop</Button>
                                <Button className="border border-orange-600 text-orange-600 bg-white">Contact</Button>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed max-w-3xl">{shopData.description}</p>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 mt-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
                    <div className="flex gap-4">
                        <div className="relative hidden md:block">
                            <input type="text" placeholder="Search in shop..." className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={20} /></button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600">No products listed yet.</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group border border-gray-100">
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded text-sm">OUT OF STOCK</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                            <Star size={12} fill="currentColor" /> 4.5
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                        <button className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-colors">
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPreview;
