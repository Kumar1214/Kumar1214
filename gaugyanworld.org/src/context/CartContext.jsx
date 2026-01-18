import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AVAILABLE_COUPONS } from '../constants/coupons';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('gaugyan_cart');
        const parsed = savedCart ? JSON.parse(savedCart) : [];
        return Array.isArray(parsed) ? parsed : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('gaugyan_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product, selectedVariation = null, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.id === product.id &&
                JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation)
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Add new item
                return [...prevItems, {
                    ...product,
                    selectedVariation,
                    quantity,
                    addedAt: new Date().toISOString()
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId, selectedVariation = null) => {
        setCartItems(prevItems =>
            prevItems.filter(item =>
                !(item.id === productId &&
                    JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation))
            )
        );
    };

    // Update item quantity
    const updateQuantity = (productId, selectedVariation, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, selectedVariation);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId &&
                    JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    const [coupon, setCoupon] = useState(null);

    // Imported from constants/coupons.js
    // Imported from constants/coupons.js
    // Actually, I can't easily add import at top with this tool if I'm replacing a specific chunk.
    // I'll leave the variable declaration here but make it reference the imported one, OR I'll use multi_replace.
    // Let's use multi_replace to add the import and remove the definition.

    const applyCoupon = (code) => {
        const foundCoupon = AVAILABLE_COUPONS.find(c => c.code === code);
        if (foundCoupon) {
            setCoupon(foundCoupon);
            return { success: true, message: 'Coupon applied successfully!' };
        }
        return { success: false, message: 'Invalid coupon code.' };
    };

    const removeCoupon = () => {
        setCoupon(null);
    };

    // Get cart totals
    const getCartTotals = () => {
        const subtotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => {
            const itemPrice = item.selectedVariation?.price || item.price;
            return total + (itemPrice * item.quantity);
        }, 0) : 0;

        let discount = 0;
        if (coupon) {
            if (subtotal >= coupon.minAmount) {
                if (coupon.type === 'percentage') {
                    discount = (subtotal * coupon.value) / 100;
                } else if (coupon.type === 'fixed') {
                    discount = coupon.value;
                }
            } else {
                // Minimum amount not met, discount remains 0
            }
        }

        const tax = (subtotal - discount) * 0.18; // 18% GST on discounted price
        const shipping = (subtotal - discount) > 500 ? 0 : 50; // Free shipping logic
        const total = (subtotal - discount) + tax + shipping;

        return {
            subtotal,
            discount,
            tax,
            shipping,
            total,
            itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
        };
    };

    // Get items grouped by vendor
    const getItemsByVendor = () => {
        const grouped = {};

        if (Array.isArray(cartItems)) {
            cartItems.forEach(item => {
                const vendorId = item.vendor?.id || 'default';
                const vendorName = item.vendor?.name || 'Gaugyan Store';

                if (!grouped[vendorId]) {
                    grouped[vendorId] = {
                        vendor: { id: vendorId, name: vendorName },
                        items: [],
                        subtotal: 0
                    };
                }

                grouped[vendorId].items.push(item);
                const itemPrice = item.selectedVariation?.price || item.price;
                grouped[vendorId].subtotal += itemPrice * item.quantity;
            });
        }

        return Object.values(grouped);
    };

    // Check if item is in cart
    const isInCart = (productId, selectedVariation = null) => {
        return Array.isArray(cartItems) && cartItems.some(item =>
            item.id === productId &&
            JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation)
        );
    };

    const value = React.useMemo(() => ({
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotals,
        getItemsByVendor,
        isInCart,
        coupon,
        applyCoupon,
        removeCoupon,
        AVAILABLE_COUPONS
    }), [cartItems, isCartOpen, coupon]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default CartContext;
