import React, { useState, useEffect, useCallback } from 'react';
import { contentService } from '../../services/api';
import { Search, Eye, X } from 'lucide-react';

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entriesPerPage, setEntriesPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                limit: entriesPerPage,
                page: currentPage,
            };

            if (statusFilter !== 'All') params.status = statusFilter;
            if (paymentFilter !== 'All') params.paymentStatus = paymentFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await contentService.getOrders(params);
            if (response.data.success) {
                setOrders(response.data.data);
                setDisplayedOrders(response.data.data); // Backend handles filtering
                setTotalPages(response.data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [entriesPerPage, currentPage, statusFilter, paymentFilter, searchQuery]);

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchOrders]);


    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: '#10B981', text: 'white' };
            case 'Processing': return { bg: '#F59E0B', text: 'white' };
            case 'Pending': return { bg: '#6B7280', text: 'white' };
            case 'Cancelled': return { bg: '#EF4444', text: 'white' };
            default: return { bg: '#6B7280', text: 'white' };
        }
    };

    return (
        <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', padding: '24px' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1F2937' }}>Orders</h1>
                </div>

                {/* Filters */}
                <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Show</label>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none', minWidth: '120px' }}
                        >
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Processing">Processing</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Payment Status</label>
                        <select
                            value={paymentFilter}
                            onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
                            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none', minWidth: '150px' }}
                        >
                            <option value="All">All</option>
                            <option value="Payment Received">Payment Received</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Search</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                placeholder="Order ID or Buyer Name"
                                style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                            />
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        </div>
                    </div>
                    <button onClick={fetchOrders} style={{ padding: '8px 20px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Refresh</button>
                </div>

                {/* Orders Table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                            <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                <tr>
                                    {['Order', 'Buyer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Options'].map(header => (
                                        <th key={header} style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</td></tr>
                                ) : displayedOrders.length === 0 ? (
                                    <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>No orders found.</td></tr>
                                ) : (
                                    displayedOrders.map((order) => (
                                        <tr key={order.id || order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '16px', fontWeight: 500 }}>#{order.orderNumber || (order.id || order.id).substring(0, 8)}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontWeight: 600 }}>
                                                        {(order.buyerName || order.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{order.buyerName || order.user?.name || 'Unknown Buyer'}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{order.buyerEmail || order.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>{order.items?.length || 0} items</td>
                                            <td style={{ padding: '16px', fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString()}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, ...getStatusColor(order.status) }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>{order.paymentStatus}</td>
                                            <td style={{ padding: '16px', color: '#6B7280', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '16px' }}>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    style={{ padding: '6px 12px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto', padding: '0', backgroundColor: '#F3F4F6' }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Order Details</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Eye size={16} /> View Invoice
                                </button>
                                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {/* Order Info & Buyer Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                {/* Order Info */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#374151' }}>Order Info</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '12px', fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 600, color: '#374151' }}>Order ID</div>
                                        <div>{selectedOrder.id}</div>

                                        <div style={{ fontWeight: 600, color: '#374151' }}>Date</div>
                                        <div>{new Date(selectedOrder.createdAt).toLocaleString()}</div>

                                        <div style={{ fontWeight: 600, color: '#374151' }}>Payment Method</div>
                                        <div>{selectedOrder.paymentMethod || 'N/A'}</div>

                                        <div style={{ fontWeight: 600, color: '#374151' }}>Status</div>
                                        <div><span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, ...getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></div>
                                    </div>
                                </div>

                                {/* Buyer Info */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#374151' }}>Buyer Info</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '12px', fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 600, color: '#374151' }}>Name</div>
                                        <div>{selectedOrder.buyerName || selectedOrder.shippingAddress?.fullName || 'N/A'}</div>

                                        <div style={{ fontWeight: 600, color: '#374151' }}>Email</div>
                                        <div>{selectedOrder.buyerEmail || 'N/A'}</div>

                                        <div style={{ fontWeight: 600, color: '#374151' }}>Phone</div>
                                        <div>{selectedOrder.buyerPhone || selectedOrder.shippingAddress?.phone || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Addresses Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                {/* Shipping Address */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#374151' }}>Shipping Address</h4>
                                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {selectedOrder.shippingAddress ? (
                                            <>
                                                <div>{selectedOrder.shippingAddress.fullName}</div>
                                                <div>{selectedOrder.shippingAddress.addressLine1}</div>
                                                {selectedOrder.shippingAddress.addressLine2 && <div>{selectedOrder.shippingAddress.addressLine2}</div>}
                                                <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</div>
                                                <div>{selectedOrder.shippingAddress.country}</div>
                                            </>
                                        ) : (
                                            <div>No shipping address provided</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Products Table */}
                            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#374151' }}>Items</h4>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                            <tr>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Product</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Unit Price</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Quantity</th>
                                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '12px' }}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            {item.product?.image && <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />}
                                                            <div>
                                                                <div style={{ fontWeight: 500 }}>{item.product?.name || 'Product'}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>ID: {item.product?.id || item.product}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px' }}>₹{item.price?.toLocaleString()}</td>
                                                    <td style={{ padding: '12px' }}>{item.quantity}</td>
                                                    <td style={{ padding: '12px', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="card" style={{ padding: '24px', maxWidth: '400px', marginLeft: 'auto' }}>
                                <div style={{ display: 'grid', gap: '12px', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 600, color: '#374151' }}>Subtotal</span>
                                        {/* Calculating subtotal manually or using order total if flat */}
                                        <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    {/* Tax/Shipping placeholders if backend provides them */}
                                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                                        <span>Total</span>
                                        <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManagement;
