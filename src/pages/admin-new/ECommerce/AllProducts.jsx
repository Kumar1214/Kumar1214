import { useState, useEffect, useCallback, useContext } from 'react';
import { Plus, Edit, Trash2, Filter, ShoppingBag, TrendingUp, DollarSign, Users, Share2, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { contentService } from '../../../services/api';
import { useData } from '../../../context/useData';
import { DataContext } from '../../../context/DataContext';
import FormModal from '../../../components/FormModal';
import ImageUploader from '../../../components/ImageUploader';
import AnalyticsGrid from '../../../components/admin/analytics/AnalyticsGrid';
import TrendingChart from '../../../components/admin/analytics/TrendingChart';
import TrendingModal from '../../../components/admin/analytics/TrendingModal';

const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Ghee & Dairy', icon: '🥛', description: 'Fresh A2 Cow Ghee and Milk Products' },
  { id: 2, name: 'Pooja Essentials', icon: '🙏', description: 'Items for daily worship and rituals' },
  { id: 3, name: 'Organic Manure', icon: '🌱', description: 'Natural compost and fertilizers' },
  { id: 4, name: 'Personal Care', icon: '🛁', description: 'Soaps, cosmetics using panchgavya' },
];

const ProductManagement = () => {
  const { refreshProducts: refreshGlobalProducts } = useData();
  const { getModuleAnalytics, getTrendingContent } = useContext(DataContext);

  // Helper for safe array handling (JSON or Array)
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch (e) {
      console.error("Error parsing array field:", e);
      return [];
    }
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState([]);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ category: '', status: '', date: '' });
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
    status: 'draft',
    featured: false
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contentService.getProducts({ limit: 100 });
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
      // Fetch vendors
      const vendorRes = await contentService.getVendors();
      if (vendorRes.data.success) {
        setVendors(vendorRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }

    // Fetch Analytics
    try {
      const analyticsData = await getModuleAnalytics('product');
      if (analyticsData) setAnalytics(analyticsData);

      const trendingData = await getTrendingContent('product', 10);
      if (trendingData) setTrending(trendingData);
    } catch (err) {
      console.error("Error fetching product analytics:", err);
    }
  }, [getModuleAnalytics, getTrendingContent]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductSubmit = async () => {
    try {
      if (editingProduct) {
        await contentService.updateProduct(editingProduct.id, newProduct);
        toast.success('Product updated successfully!');
      } else {
        await contentService.createProduct(newProduct);
        toast.success('Product created successfully!');
      }
      fetchProducts();
      refreshGlobalProducts?.();
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.");
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
      status: 'draft',
      featured: false
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
      images: parseArrayField(product.images)
    });
    setShowProductModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await contentService.deleteProduct(id);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Analytics Section */}
      <AnalyticsGrid
        metrics={[
          { title: 'Total Products', value: analytics?.totalItems || products.length, icon: ShoppingBag, color: 'indigo' },
          { title: 'Total Sales', value: analytics?.totalSales?.toLocaleString() || '854', icon: Users, color: 'blue', trend: 'up', trendValue: 24 },
          { title: 'Revenue', value: analytics?.totalRevenue ? `₹${analytics.totalRevenue.toLocaleString()}` : "₹1,24,500", icon: DollarSign, color: 'green', trend: 'up', trendValue: 31 },
          { title: 'Total Shares', value: analytics?.overview?.totalShares?.toLocaleString() || '156', icon: Share2, color: 'purple' }
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Sales Trends</h3>
            <button
              onClick={() => setShowTrendingModal(true)}
              style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}
            >
              <TrendingUp size={16} /> View Top 50
            </button>
          </div>
          <TrendingChart data={trending.length > 0 ? trending : products.slice(0, 8)} dataKey="sales" />
        </div>

        <div style={{ backgroundColor: '#0c2d50', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 12px 0' }}>Sales Insights</h3>
          <p style={{ fontSize: '0.9rem', color: '#E5E7EB', lineHeight: 1.5, flex: 1 }}>
            Your "A2 Ghee" products are trending upwards. Stock levels for 1kg containers are low. Recommended: Increase stock for Festive Season.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: '#9CA3AF' }}>Best Seller</span>
              <span style={{ fontWeight: 600 }}>Cows Ghee 1L</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#9CA3AF' }}>Returning Customers</span>
              <span style={{ fontWeight: 600 }}>42%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
        <h3>Product Inventory ({products.length} products)</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowFilterModal(true)}
            style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
          {filteredProducts.map(product => (
            <div key={product.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                <img src={parseArrayField(product.images)?.[0] || 'https://via.placeholder.com/60'} alt={product.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '4px', fontSize: '1.1rem' }}>{product.name}</h4>
                  <div style={{ display: 'flex', gap: '12px', color: '#6B7280', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>₹{product.price}</span>
                    <span>•</span>
                    <span>Stock: {product.stock}</span>
                    <span>•</span>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: product.status === 'active' ? '#D1FAE5' : '#FEF3C7', color: product.status === 'active' ? '#065F46' : '#92400E', fontSize: '0.75rem' }}>{product.status}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(product)} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', color: '#4B5563' }}><Edit size={18} /></button>
                <button onClick={() => handleDelete(product.id)} style={{ padding: '8px', border: '1px solid #FCA5A5', color: '#B91C1C', borderRadius: '4px', cursor: 'pointer', background: '#FEF2F2' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

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
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Vendor</label>
          <select
            value={newProduct.vendor}
            onChange={e => setNewProduct({ ...newProduct, vendor: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
          >
            <option value="">Select Vendor</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.storeName || v.user?.name || v.contactEmail || 'Unknown Vendor'}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Status</label>
          <select value={newProduct.status} onChange={e => setNewProduct({ ...newProduct, status: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}>
            <option value="pending_approval">Pending Approval</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows={4}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          <div style={{ paddingTop: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newProduct.featured || false}
                onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Featured Product</span>
            </label>
          </div>
        </div>
        <ImageUploader label="Product Images" multiple value={newProduct.images} onChange={(urls) => setNewProduct({ ...newProduct, images: urls })} />
      </FormModal>

      <TrendingModal
        isOpen={showTrendingModal}
        onClose={() => setShowTrendingModal(false)}
        title="Top Selling Products"
        data={trending.length > 0 ? trending : products}
        metricKey="sales"
        metricLabel="Sales"
      />

      {/* Filter Modal */}
      {showFilterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ padding: '24px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Filter Products</h3>
              <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
              <select
                value={filterConfig.category}
                onChange={e => setFilterConfig({ ...filterConfig, category: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              >
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Status</label>
              <select
                value={filterConfig.status}
                onChange={e => setFilterConfig({ ...filterConfig, status: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date Created</label>
              <input
                type="date"
                value={filterConfig.date}
                onChange={e => setFilterConfig({ ...filterConfig, date: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => {
                setFilterConfig({ category: '', status: '', date: '' });
                setFilteredProducts(products);
                setShowFilterModal(false);
              }} style={{ padding: '8px 16px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>Reset</button>
              <button onClick={() => {
                let res = products;
                if (filterConfig.category) res = res.filter(p => p.category === filterConfig.category);
                if (filterConfig.status) res = res.filter(p => p.status === filterConfig.status);
                if (filterConfig.date) {
                  res = res.filter(p => (p.createdAt || '').startsWith(filterConfig.date));
                }
                setFilteredProducts(res);
                setShowFilterModal(false);
              }} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
