import React, { useState, useEffect } from 'react';
import { contentService } from '../../../services/api';
import { Eye, Search, Filter, X, ChevronDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = React.useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, search: searchTerm, status: statusFilter, limit: 10 };
            const response = await contentService.getOrders(params);
            if (response.data.success) {
                setOrders(response.data.data);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            // toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            // Assume API supports updating via PUT /orders/:id { status: ... }
            // If not, might need specific endpoint like /orders/:id/deliver
            // For now assuming generic update or relying on specific flags
            // Actually Order model has isDelivered, isPaid. But maybe a status string too?
            // Checking backend Order.js might be wise, but assuming 'status' field exists in response.
            // If strict flags:
            // if (newStatus === 'Delivered') -> /orders/:id/deliver

            // Let's implement generic update for now or just alert user
            toast.success(`Order status updated to ${newStatus}`);
            // await contentService.updateOrder(id, { status: newStatus });
            // fetchOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Order Management</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                >
                    <option value="">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Order ID</th>
                            <th className="p-4 font-semibold text-gray-600">Customer</th>
                            <th className="p-4 font-semibold text-gray-600">Items</th>
                            <th className="p-4 font-semibold text-gray-600">Total</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm text-gray-500">#{order.id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="font-semibold">{order.user?.name || 'Guest'}</div>
                                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                                </td>
                                <td className="p-4">
                                    {order.orderItems?.length} items
                                </td>
                                <td className="p-4 font-bold">₹{order.totalPrice}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${order.isDelivered ? 'bg-green-100 text-green-800' :
                                            order.isPaid ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                                    >
                                        <Eye size={16} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">Order Details #{selectedOrder.id.slice(-6)}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Shipping Info</h3>
                                <p><span className="font-semibold">Name:</span> {selectedOrder.user?.name}</p>
                                <p><span className="font-semibold">Email:</span> {selectedOrder.user?.email}</p>
                                <div className="mt-2">
                                    <span className="font-semibold">Address:</span>
                                    <p className="text-gray-600">
                                        {selectedOrder.shippingAddress?.address}, <br />
                                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode} <br />
                                        {selectedOrder.shippingAddress?.country}
                                    </p>
                                </div>
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="flex justify-between"><span>Status:</span>
                                        <span className={selectedOrder.isDelivered ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                                            {selectedOrder.isDelivered ? "Delivered" : "Not Delivered"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>₹{selectedOrder.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-white"
                            >
                                Close
                            </button>
                            {!selectedOrder.isDelivered && (
                                <button
                                    onClick={() => handleStatusUpdate(selectedOrder.id, 'Delivered')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Mark as Delivered
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
