import React, { useState, useEffect } from 'react';
import Button from '../../Button';
import { Plus, Trash2, X } from 'lucide-react';
import { contentService } from '../../../services/api';
import toast from 'react-hot-toast';

const ProductForm = ({ product, onClose, onSuccess, isVendor = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        originalPrice: '',
        stock: '',
        images: [''],
        variants: [],
        vendor: '', // If admin
        status: 'active'
    });

    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]); // For admin to select vendor

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                price: product.price || '',
                originalPrice: product.originalPrice || '',
                stock: product.stock || '',
                images: product.images?.length > 0 ? product.images : [''],
                variants: product.variants || [],
                vendor: product.vendor?.id || product.vendor || '',
                status: product.status || 'active'
            });
        }

        // Fetch vendors for dropdown
        const fetchVendors = async () => {
            try {
                const res = await contentService.getVendors();
                if (res.data.success) setVendors(res.data.data);
            } catch (err) {
                console.error("Failed to fetch vendors");
            }
        };
        fetchVendors();

    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    const addVariant = () => {
        setFormData({ ...formData, variants: [...formData.variants, { name: '', options: [], price: '', stock: '' }] });
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: formData.images.filter(img => img.trim() !== '')
        };

        try {
            if (product) {
                await contentService.updateProduct(product.id, payload);
                toast.success("Product updated successfully");
            } else {
                await contentService.createProduct(payload);
                toast.success("Product created successfully");
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded-lg">
                        <option value="">Select Category</option>
                        <option value="Puja Items">Puja Items</option>
                        <option value="Ayurvedic Products">Ayurvedic Products</option>
                        <option value="Organic">Organic</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Handicrafts">Handicrafts</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} min="0" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full p-2 border rounded-lg" />
                </div>
                {!isVendor && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional for Admin)</label>
                        <select name="vendor" value={formData.vendor} onChange={handleChange} className="w-full p-2 border rounded-lg">
                            <option value="">Select Vendor</option>
                            {vendors.map(v => (
                                <option key={v.id} value={v.id}>{v.storeName} ({v.owner})</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded-lg"></textarea>
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs)</label>
                {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={img}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 p-2 border rounded-lg"
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => removeImageField(index)} className="text-red-500 p-2">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addImageField} className="text-sm text-blue-600 font-medium flex items-center gap-1 mt-1">
                    <Plus size={16} /> Add Image URL
                </button>
            </div>

            {/* Variants (Simplified for now - just Name/Value pairs or simple structure) */}
            {/* ... Implement if needed later ... */}

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
            </div>
        </form>
    );
};

export default ProductForm;
