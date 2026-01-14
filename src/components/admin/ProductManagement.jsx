import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { contentService } from '../../services/api';
import FormModal from '../FormModal';
import ImageUploader from '../ImageUploader';

const PRODUCT_CATEGORIES = [
    { id: 1, name: 'Ghee & Dairy', icon: '🥛', description: 'Fresh A2 Cow Ghee and Milk Products' },
    { id: 2, name: 'Pooja Essentials', icon: '🙏', description: 'Items for daily worship and rituals' },
    { id: 3, name: 'Organic Manure', icon: '🌱', description: 'Natural compost and fertilizers' },
    { id: 4, name: 'Personal Care', icon: '🛁', description: 'Soaps, cosmetics using panchgavya' },
];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        category: '',
        stock: 0,
        sku: '',
        images: [''],
        vendor: '',
        status: 'draft'
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await contentService.getProducts({ limit: 100 });
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await contentService.updateProduct(editingProduct.id || editingProduct.id, newProduct);
                alert('Product updated successfully!');
            } else {
                await contentService.createProduct(newProduct);
                alert('Product created successfully!');
            }
            fetchProducts();
            setShowProductModal(false);
            setEditingProduct(null);
            resetProductForm();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    const resetProductForm = () => {
        setNewProduct({
            name: '',
            description: '',
            price: 0,
            originalPrice: 0,
            category: PRODUCT_CATEGORIES[0]?.name || '',
            stock: 0,
            sku: '',
            images: [''],
            vendor: '',
            status: 'draft'
        });
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            ...product,
            images: Array.isArray(product.images) ? product.images : [product.images]
        });
        setShowProductModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await contentService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    return (
        <div>
            {/* Products Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Product Inventory ({products.length} products)</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Filter size={16} /> Filter
                        </button>
                        <button onClick={() => { resetProductForm(); setShowProductModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                            <Plus size={18} /> Add Product
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading Products...</div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                        {products.map(product => (
                            <div key={product.id || product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                                    <img src={product.images?.[0] || 'https://via.placeholder.com/60'} alt={product.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{product.name}</h4>
                                        <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                            <span>{product.category}</span>
                                            <span>•</span>
                                            <span>₹{product.price}</span>
                                            <span>•</span>
                                            <span>Stock: {product.stock}</span>
                                            <span>•</span>
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: product.status === 'published' ? '#D1FAE5' : '#FEF3C7', color: product.status === 'published' ? '#065F46' : '#92400E', fontSize: '0.75rem' }}>{product.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEdit(product)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(product.id || product.id)} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <FormModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'} onSubmit={handleProductSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Product Name *</label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                        <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option value="">Select Category</option>
                            {PRODUCT_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>SKU *</label>
                        <input type="text" required value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Price (₹) *</label>
                        <input type="number" min="0" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Original Price (₹)</label>
                        <input type="number" min="0" value={newProduct.originalPrice} onChange={e => setNewProduct({ ...newProduct, originalPrice: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Stock *</label>
                        <input type="number" min="0" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Vendor</label>
                        <select
                            value={newProduct.vendor}
                            onChange={e => setNewProduct({ ...newProduct, vendor: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        >
                            <option value="">Select Vendor</option>
                            <option value="Organic Farms India">Organic Farms India</option>
                            <option value="Vedic Ghee Co.">Vedic Ghee Co.</option>
                            <option value="Desi Cow Products">Desi Cow Products</option>
                            <option value="Gau Seva Kendra">Gau Seva Kendra</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Status</label>
                        <select value={newProduct.status} onChange={e => setNewProduct({ ...newProduct, status: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
                    <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={4}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                </div>
                <ImageUploader label="Product Images" multiple value={newProduct.images} onChange={(urls) => setNewProduct({ ...newProduct, images: urls })} />
            </FormModal>
        </div>
    );
};

export default ProductManagement;
