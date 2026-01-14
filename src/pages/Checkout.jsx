import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, Package, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useCart } from '../context/CartContext';
import api from '../services/api'; // Ensure this matches your api service path

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotals, clearCart, coupon, applyCoupon, removeCoupon, AVAILABLE_COUPONS } = useCart();

    // Existing totals from context (local calculation)
    const { subtotal, discount } = getCartTotals();

    // Dynamic calculation state
    const [calcShipping, setCalcShipping] = useState(0);
    const [calcTax, setCalcTax] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Shipping Info
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        // Payment Info
        paymentMethod: 'cod'
    });

    // Debounced Calculation Effect
    useEffect(() => {
        const calculateCosts = async () => {
            if (!formData.pincode || formData.pincode.length < 3) return;

            setIsCalculating(true);
            try {
                const weight = cartItems.reduce((acc, item) => acc + (item.quantity * 1), 0); // Approx 1kg per item if not defined

                const res = await api.post('/shipping/calculate', {
                    state: formData.state,
                    pincode: formData.pincode,
                    subtotal: subtotal - discount,
                    weight: weight
                });

                if (res.data.success) {
                    setCalcShipping(res.data.data.shipping);
                    setCalcTax(res.data.data.tax);
                }
            } catch (error) {
                console.error("Shipping calc error", error);
            } finally {
                setIsCalculating(false);
            }
        };

        const timeoutId = setTimeout(() => {
            calculateCosts();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [formData.pincode, formData.state, subtotal, discount, cartItems]);

    // Final Total
    // If we have calculated values, use them. Otherwise default fallback (though we start 0).
    const finalTotal = (subtotal - discount) + calcTax + calcShipping;


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Process order
            try {
                // Should define createOrder API call here eventually
                // await api.post('/orders', { ...formData, items: cartItems, total: finalTotal ... });
                clearCart();
                // In real app, we would send order data to backend here
                navigate('/thank-you');
            } catch (err) {
                console.error(err);
                alert('Order failed');
            }
        }
    };

    const steps = [
        { number: 1, title: 'Shipping', icon: <MapPin size={20} /> },
        { number: 2, title: 'Payment', icon: <CreditCard size={20} /> },
        { number: 3, title: 'Review', icon: <Package size={20} /> }
    ];

    if (cartItems.length === 0 && currentStep === 1) {
        return (
            <div className="container mt-lg" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--spacing-md)' }}>
                    Add some products to your cart to proceed to checkout.
                </p>
                <Link to="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    // ... (rest of render until Order Total section)
    return (
        <div className="container mt-lg" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* ... (Header & Steps - kept same in replacement or via context logic if large) ... */}
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', textDecoration: 'none', marginBottom: 'var(--spacing-md)' }}>
                <ArrowLeft size={20} />
                Back to Cart
            </Link>

            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2xl)' }}>Checkout</h1>

            {/* Progress Steps */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-3xl)',
                position: 'relative'
            }}>
                {/* Progress Line */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#E5E7EB',
                    zIndex: 0
                }}>
                    <div style={{
                        height: '100%',
                        backgroundColor: 'var(--color-primary)',
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        transition: 'width 0.3s'
                    }} />
                </div>

                {steps.map((step) => (
                    <div key={step.number} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: currentStep >= step.number ? 'var(--color-primary)' : 'white',
                            border: `2px solid ${currentStep >= step.number ? 'var(--color-primary)' : '#E5E7EB'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: currentStep >= step.number ? 'white' : '#9CA3AF',
                            marginBottom: '8px'
                        }}>
                            {currentStep > step.number ? <CheckCircle size={20} /> : step.icon}
                        </div>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: currentStep === step.number ? 600 : 400,
                            color: currentStep >= step.number ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                        }}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Shipping Information</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your full name"
                            />
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="+91 XXXXX XXXXX"
                        />

                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            placeholder="Street address, apartment, suite, etc."
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                                placeholder="XXXXXX"
                            />
                        </div>

                        <Button type="submit" style={{ marginTop: 'var(--spacing-lg)' }}>
                            Continue to Payment
                        </Button>
                    </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Payment Method</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <label style={{
                                padding: 'var(--spacing-md)',
                                border: `2px solid ${formData.paymentMethod === 'cod' ? 'var(--color-primary)' : '#E5E7EB'}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)'
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleInputChange}
                                />
                                <div>
                                    <div style={{ fontWeight: 600 }}>Cash on Delivery</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pay when you receive</div>
                                </div>
                            </label>

                            <label style={{
                                padding: 'var(--spacing-md)',
                                border: `2px solid ${formData.paymentMethod === 'online' ? 'var(--color-primary)' : '#E5E7EB'}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)'
                            }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={formData.paymentMethod === 'online'}
                                    onChange={handleInputChange}
                                />
                                <div>
                                    <div style={{ fontWeight: 600 }}>Online Payment</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>UPI, Cards, Net Banking</div>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Back
                            </button>
                            <Button type="submit" style={{ flex: 1 }}>
                                Review Order
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Review Your Order</h2>

                        {/* Shipping Details */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Shipping To:</h3>
                            <div style={{ backgroundColor: '#F9FAFB', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontWeight: 600 }}>{formData.fullName}</p>
                                <p>{formData.address}</p>
                                <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                                <p>{formData.phone}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Payment Method:</h3>
                            <div style={{ backgroundColor: '#F9FAFB', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontWeight: 600 }}>
                                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                </p>
                            </div>
                        </div>

                        {/* Order Items - Using same map as before */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)' }}>Items:</h3>
                            <div style={{ border: '1px solid #E5E7EB', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${JSON.stringify(item.selectedVariation)}`} style={{ display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', lineHeight: '1.2' }}>{item.name}</h4>
                                            {item.selectedVariation && (
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>
                                                    {Object.values(item.selectedVariation).join(', ')}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--color-text-light)' }}>Qty: {item.quantity}</span>
                                                <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coupon Section (Same as before) */}
                        <div style={{ marginBottom: 'var(--spacing-xl)', padding: '16px', border: '1px dashed #E5E7EB', borderRadius: '12px' }}>
                            {/* ... (Same coupon code) ... */}
                            {/* Using existing logic for coupons */}
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🎟️</span> Apply Coupon
                            </h3>
                            {coupon ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #10B981' }}>
                                    <div>
                                        <span style={{ fontWeight: 700, color: '#047857' }}>{coupon.code}</span> applied!
                                        <div style={{ fontSize: '0.8rem', color: '#059669' }}>{coupon.description}</div>
                                    </div>
                                    <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#EF4444', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <input type="text" placeholder="Enter coupon code" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} id="couponInput" />
                                        <button type="button" onClick={() => {
                                            const code = document.getElementById('couponInput').value;
                                            const result = applyCoupon(code);
                                            if (!result.success) alert(result.message);
                                        }} style={{ padding: '10px 20px', backgroundColor: '#374151', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Apply</button>
                                    </div>
                                    {/* Available Coupons List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Available Coupons:</p>
                                        {AVAILABLE_COUPONS.map(c => (
                                            <button key={c.code} type="button" onClick={() => applyCoupon(c.code)} style={{ textAlign: 'left', padding: '8px 12px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span><strong>{c.code}</strong>: {c.description}</span>
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Apply</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Total - UPDATED */}
                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)', marginBottom: '4px' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', marginBottom: '4px', fontWeight: 600 }}>
                                    <span>Discount ({coupon?.code})</span>
                                    <span>- ₹{discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)', marginBottom: '4px' }}>
                                <span>Tax (18%) {isCalculating && <span className="text-xs text-orange-500">(Calculating...)</span>}</span>
                                <span>₹{calcTax.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)', marginBottom: '12px' }}>
                                <span>Shipping {isCalculating && <span className="text-xs text-orange-500">(Calculating...)</span>}</span>
                                <span>{calcShipping === 0 ? 'Free' : `₹${calcShipping.toFixed(2)}`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700 }}>
                                <span>Total Amount:</span>
                                <span style={{ color: 'var(--color-primary)' }}>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Back
                            </button>
                            <Button type="submit" style={{ flex: 1 }}>
                                Place Order
                            </Button>
                        </div>
                    </div>
                )}

            </form>
        </div>
    );
};

export default Checkout;
