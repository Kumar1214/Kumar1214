import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const LastViewedProducts = ({ products }) => {
    const [viewedProducts, setViewedProducts] = useState([]);

    useEffect(() => {
        // In a real app, we would read from localStorage
        // const viewedIds = JSON.parse(localStorage.getItem('lastViewedProducts') || '[]');
        // const viewed = products.filter(p => viewedIds.includes(p.id));

        // For demo, just show the last 4 products or random ones
        // We'll just take the first 4 for now to populate the UI
        if (products && products.length > 0) {
            setViewedProducts(products.slice(0, 4));
        }
    }, [products]);

    if (!viewedProducts || viewedProducts.length === 0) return null;

    return (
        <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)', fontWeight: 600 }}>Last Viewed Products</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                {viewedProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
};

export default LastViewedProducts;
