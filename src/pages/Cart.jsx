import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotals, getItemsByVendor } = useCart();

    const { subtotal, tax, shipping, total } = getCartTotals();
    const vendorGroups = getItemsByVendor();

    // Helper for image URLs
    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/120';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'https://gaugyanworld.org'}${path}`;
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <ShoppingBag size={64} color="#D1D5DB" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)' }}>
                    Add items to your cart to continue shopping
                </p>
                <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mt-lg" style={{ paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-lg)',
                    fontWeight: 600
                }}
            >
                <ArrowLeft size={20} />
                Continue Shopping
            </button>

            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2xl)' }}>Shopping Cart ({cartItems.length} items)</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-2xl)' }}>

                {/* Cart Items - Grouped by Vendor */}
                <div>
                    {vendorGroups.map((group, groupIndex) => (
                        <div key={group.vendor.id} style={{ marginBottom: '2rem' }}>
                            {/* Vendor Header */}
                            <div style={{
                                backgroundColor: '#F9FAFB',
                                padding: '1rem',
                                borderRadius: '8px 8px 0 0',
                                borderBottom: '2px solid #E5E7EB'
                            }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1F2937' }}>
                                    🏪 {group.vendor.name}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px' }}>
                                    Subtotal: ₹{group.subtotal.toFixed(2)}
                                </p>
                            </div>

                            {/* Vendor Items */}
                            {group.items.map(item => {
                                const itemPrice = item.selectedVariation?.price || item.price;
                                return (
                                    <div key={`${item.id}-${JSON.stringify(item.selectedVariation)}`} className="card" style={{
                                        marginBottom: groupIndex === vendorGroups.length - 1 ? 0 : 0,
                                        padding: 'var(--spacing-lg)',
                                        display: 'flex',
                                        gap: 'var(--spacing-lg)',
                                        borderRadius: 0,
                                        borderBottom: '1px solid #E5E7EB'
                                    }}>
                                        {/* Product Image */}
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            cursor: 'pointer'
                                        }} onClick={() => navigate(`/product/${item.id}`)}>
                                            <img
                                                src={getImageUrl(item.images?.[0])}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3
                                                    style={{ fontSize: '1.1rem', marginBottom: '0.5rem', cursor: 'pointer' }}
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                >
                                                    {item.name}
                                                </h3>

                                                {/* Show selected variation */}
                                                {item.selectedVariation && (
                                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                                        {Object.entries(item.selectedVariation.attributes || {}).map(([key, value]) => (
                                                            <span key={key} style={{ marginRight: '1rem' }}>
                                                                <strong>{key}:</strong> {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                                    ₹{itemPrice}
                                                </p>

                                                {/* Stock status */}
                                                {item.selectedVariation?.stock !== undefined && (
                                                    <p style={{
                                                        fontSize: '0.875rem',
                                                        color: item.selectedVariation.stock > 0 ? '#10B981' : '#EF4444',
                                                        marginTop: '4px'
                                                    }}>
                                                        {item.selectedVariation.stock > 0
                                                            ? `${item.selectedVariation.stock} in stock`
                                                            : 'Out of stock'}
                                                    </p>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {/* Quantity Controls */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.selectedVariation, item.quantity - 1)}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            border: '1px solid #E5E7EB',
                                                            backgroundColor: 'white',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.selectedVariation, item.quantity + 1)}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            border: '1px solid #E5E7EB',
                                                            backgroundColor: 'white',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.selectedVariation)}
                                                    style={{
                                                        padding: '8px',
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        color: '#EF4444',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Tax (GST 18%)</span>
                                <span style={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
                                <span style={{ fontWeight: 600, color: shipping === 0 ? '#10B981' : 'inherit' }}>
                                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                </span>
                            </div>
                            {subtotal < 500 && (
                                <p style={{ fontSize: '0.85rem', color: '#F59E0B', backgroundColor: '#FEF3C7', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                                    Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                                </p>
                            )}
                            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                <span style={{ fontWeight: 700 }}>Total</span>
                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button fullWidth onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </Button>

                        <button
                            onClick={() => navigate('/shop')}
                            style={{
                                width: '100%',
                                marginTop: 'var(--spacing-md)',
                                padding: '12px',
                                border: '1px solid var(--color-primary)',
                                backgroundColor: 'white',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;
