import React, { useState } from 'react';
import { useData } from '../context/useData';
import { Package, Calendar, Eye, Download, X } from 'lucide-react';
import UserDashboardLayout from '../layout/UserDashboardLayout';

const MyOrders = () => {
    const { orders } = useData();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleDownloadInvoice = (order) => {
        // Simple invoice print logic
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${order.id}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                    .invoice-title { font-size: 24px; font-weight: bold; color: #EA580C; }
                    .meta { margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
                    th { background-color: #f9f9f9; }
                    .total { text-align: right; font-size: 20px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="invoice-title">GauGyan Invoice</div>
                        <div>Order #${order.id}</div>
                    </div>
                    <div style="text-align: right;">
                        <div>Date: ${new Date(order.date).toLocaleDateString()}</div>
                        <div>Status: ${order.status}</div>
                    </div>
                </div>

                <div class="meta">
                    <strong>Billed To:</strong><br>
                    ${order.buyerName || 'Valued Customer'}<br>
                    ${order.buyerEmail || ''}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>₹${item.price}</td>
                                <td>₹${item.price * item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total">
                    Total: ₹${order.total}
                </div>
                
                <script>
                    setTimeout(() => { window.print(); }, 500);
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    // Return/Refund Modal state
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
    const [returnReason, setReturnReason] = useState('');
    const [returnComment, setReturnComment] = useState('');

    // Mock reasons (should ideally come from backend config)
    const refundReasons = [
        'Product damaged in transit',
        'Wrong item received',
        'Quality not as expected',
        'Changed mind',
        'Item missing from package',
        'Expired product'
    ];

    const openReturnModal = (order) => {
        setSelectedReturnOrder(order);
        setReturnReason('');
        setReturnComment('');
        setReturnModalOpen(true);
    };

    const handleSubmitReturn = () => {
        // Here you would call an API endpoint to submit the return request
        const returnRequest = {
            orderId: selectedReturnOrder.id,
            reason: returnReason,
            comment: returnComment,
            items: selectedReturnOrder.items
        };
        console.log("Submitting return request:", returnRequest);

        // Mock success feedback
        alert(`Return request submitted for Order #${selectedReturnOrder.id}`);
        setReturnModalOpen(false);
        setSelectedReturnOrder(null);
    };

    return (
        <UserDashboardLayout title="My Orders" subtitle="Track and view your order history">
            {orders && orders.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>Order #{order.id}</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F2937' }}>₹{order.total}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        backgroundColor: order.status === 'Completed' ? '#DEF7EC' : order.status === 'Processing' ? '#E1EFFE' : '#F3F4F6',
                                        color: order.status === 'Completed' ? '#03543F' : order.status === 'Processing' ? '#1E429F' : '#374151'
                                    }}>
                                        {order.status}
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {order.status === 'Completed' && (
                                            <button
                                                onClick={() => openReturnModal(order)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #EA580C',
                                                    backgroundColor: 'white',
                                                    color: '#EA580C',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Return
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: '1px solid #E5E7EB',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#4B5563'
                                            }}
                                            title="View Details"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} />
                                    {new Date(order.date).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {order.items.slice(0, 2).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#1F2937' }}>{item.quantity}x {item.name}</span>
                                            <span style={{ color: '#6B7280', fontWeight: 500 }}>₹{item.price}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 2 && (
                                        <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                                            + {order.items.length - 2} more items...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
                    <Package size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No orders yet</h3>
                    <p style={{ color: '#6B7280' }}>Looks like you haven't placed any orders yet.</p>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '20px'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Order ID</div>
                                    <div style={{ fontWeight: 600 }}>#{selectedOrder.id}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Date Placed</div>
                                    <div style={{ fontWeight: 600 }}>{new Date(selectedOrder.date).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Items Ordered</h3>
                            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '48px', height: '48px', backgroundColor: '#F3F4F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Package size={20} color="#9CA3AF" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500, color: '#1F2937' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Quantity: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '2px solid #E5E7EB', marginBottom: '24px' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Amount</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EA580C' }}>₹{selectedOrder.total}</span>
                            </div>

                            <button
                                onClick={() => handleDownloadInvoice(selectedOrder)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#1F2937',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Download size={20} /> Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Return Modal */}
            {returnModalOpen && selectedReturnOrder && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '20px'
                }} onClick={() => setReturnModalOpen(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1F2937', margin: 0 }}>Request Return</h2>
                            <button onClick={() => setReturnModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '4px' }}>Returning items for Order</div>
                                <div style={{ fontWeight: 600 }}>#{selectedReturnOrder.id}</div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Reason for Return</label>
                                <select
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                                >
                                    <option value="">Select a reason</option>
                                    {refundReasons.map((reason, idx) => (
                                        <option key={idx} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Comments / Details</label>
                                <textarea
                                    value={returnComment}
                                    onChange={(e) => setReturnComment(e.target.value)}
                                    rows="4"
                                    placeholder="Please provide more details about why you want to return this order..."
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setReturnModalOpen(false)}
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#374151', fontWeight: 500, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReturn}
                                    disabled={!returnReason}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: returnReason ? '#EA580C' : '#FDBA74',
                                        color: 'white',
                                        fontWeight: 500,
                                        cursor: returnReason ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserDashboardLayout>
    );
};

export default MyOrders;
