/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('gaugyan_wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    const isLoggedIn = !!localStorage.getItem('token');

    // Fetch from backend if logged in
    useEffect(() => {
        if (isLoggedIn) {
            const fetchWishlist = async () => {
                try {
                    const response = await userService.getWishlist();
                    if (response.data) {
                        setWishlistItems(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            };
            fetchWishlist();
        }
    }, [isLoggedIn]);

    // Save to localStorage when items change (only if not logged in, or as backup)
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('gaugyan_wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isLoggedIn]);

    const addToWishlist = async (product) => {
        if (isInWishlist(product.id || product.id)) return;
        await toggleWishlist(product);
    };

    const removeFromWishlist = async (productId) => {
        const product = wishlistItems.find(item => (item.id || item.id) === productId);
        if (product) {
            await toggleWishlist(product);
        }
    };

    const toggleWishlist = async (product) => {
        const productId = product.id || product.id;

        // Optimistic Update
        const exists = isInWishlist(productId);
        let newItems;
        if (exists) {
            newItems = wishlistItems.filter(item => (item.id || item.id) !== productId);
        } else {
            newItems = [...wishlistItems, product];
        }

        setWishlistItems(newItems);

        if (isLoggedIn) {
            try {
                await userService.toggleWishlist(productId);
            } catch (error) {
                console.error('Error syncing wishlist:', error);
                // Revert if needed, but for now just log
            }
        }
    };

    const isInWishlist = (productId) => {
        return Array.isArray(wishlistItems) && wishlistItems.some(item => (item.id || item.id) === productId);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
        if (!isLoggedIn) localStorage.removeItem('gaugyan_wishlist');
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};


