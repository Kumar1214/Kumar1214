import React from 'react';
import { Truck } from 'lucide-react';

const ShippingPolicy = () => {
    return (
        <div className="container mt-lg" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                <Truck size={48} color="#6366F1" style={{ margin: '0 auto var(--spacing-md)' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Shipping & Delivery Policy</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Last updated: November 26, 2024</p>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>1. Overview</h2>
                <p>This Shipping & Delivery Policy outlines the terms and conditions for the delivery of products purchased through Gaugyan LMS. We are committed to delivering your orders in a timely and efficient manner.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>2. Shipping Coverage</h2>
                <p>We currently ship to all locations within India. International shipping is not available at this time.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>3. Processing Time</h2>
                <p>Orders are processed within 1-2 business days (Monday-Saturday, excluding public holidays). Orders placed on Sundays or holidays will be processed on the next business day.</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li><strong>Standard Processing:</strong> 1-2 business days</li>
                    <li><strong>Dairy Products:</strong> Same day processing for orders placed before 10 AM</li>
                    <li><strong>Custom Orders:</strong> 3-5 business days</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>4. Shipping Methods & Delivery Time</h2>
                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>4.1 Standard Delivery</h3>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li><strong>Metro Cities:</strong> 3-5 business days</li>
                    <li><strong>Other Cities:</strong> 5-7 business days</li>
                    <li><strong>Rural Areas:</strong> 7-10 business days</li>
                    <li><strong>Shipping Cost:</strong> ₹50 for orders below ₹500, FREE for orders above ₹500</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>4.2 Express Delivery</h3>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li><strong>Metro Cities:</strong> 1-2 business days</li>
                    <li><strong>Other Cities:</strong> 2-3 business days</li>
                    <li><strong>Shipping Cost:</strong> ₹150 (available for select locations)</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>4.3 Same Day Delivery</h3>
                <p>Available in select metro cities for orders placed before 10 AM. Shipping cost: ₹200</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>5. Order Tracking</h2>
                <p>Once your order is shipped, you will receive a confirmation email with tracking information. You can track your order using:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Tracking number provided in the shipping confirmation email</li>
                    <li>Your account dashboard on our website</li>
                    <li>Courier partner's website</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>6. Delivery Address</h2>
                <p>Please ensure that your delivery address is correct and complete. We are not responsible for delays or non-delivery due to incorrect or incomplete addresses. Address changes can be made within 2 hours of order placement by contacting customer support.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>7. Delivery Attempts</h2>
                <p>Our courier partners will make up to 3 delivery attempts. If delivery is unsuccessful after 3 attempts, the order will be returned to us. You may be charged a re-shipping fee for re-delivery.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>8. Special Handling for Perishable Items</h2>
                <p>Dairy products and other perishable items are shipped with special packaging to maintain freshness:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Temperature-controlled packaging</li>
                    <li>Ice packs for extended freshness</li>
                    <li>Priority shipping to ensure quick delivery</li>
                    <li>Delivery within 24-48 hours for metro cities</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>9. Damaged or Lost Packages</h2>
                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>9.1 Damaged Packages</h3>
                <p>If your package arrives damaged, please:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li>Take photos of the damaged package and product</li>
                    <li>Contact us within 24 hours of delivery</li>
                    <li>We will arrange for a replacement or refund</li>
                </ul>

                <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>9.2 Lost Packages</h3>
                <p>If your package is lost in transit, please contact us. We will investigate with the courier partner and provide a replacement or full refund.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>10. Returns and Refunds</h2>
                <p>We accept returns within 7 days of delivery for non-perishable items in original, unused condition. Perishable items (dairy products) are not eligible for return unless damaged or defective.</p>
                <p>Return shipping costs:</p>
                <ul style={{ marginLeft: '20px', marginBottom: 'var(--spacing-lg)' }}>
                    <li><strong>Defective/Damaged items:</strong> Free return shipping</li>
                    <li><strong>Change of mind:</strong> Customer bears return shipping cost</li>
                </ul>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>11. Holidays and Peak Seasons</h2>
                <p>During holidays and peak seasons (Diwali, Holi, etc.), delivery times may be extended by 2-3 business days. We will notify you of any expected delays.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>12. Force Majeure</h2>
                <p>We are not liable for delays or failures in delivery due to circumstances beyond our control, including but not limited to natural disasters, strikes, government actions, or pandemic-related restrictions.</p>

                <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>13. Contact Us</h2>
                <p>For shipping-related queries, please contact us at:</p>
                <div style={{ padding: 'var(--spacing-lg)', backgroundColor: '#F3F4F6', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-md)' }}>
                    <p style={{ marginBottom: '8px' }}><strong>Email:</strong> shipping@gaugyan.com</p>
                    <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> +91 1234567890</p>
                    <p style={{ marginBottom: '8px' }}><strong>WhatsApp:</strong> +91 9876543210</p>
                    <p><strong>Customer Support Hours:</strong> Monday-Saturday, 9:00 AM - 6:00 PM IST</p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
