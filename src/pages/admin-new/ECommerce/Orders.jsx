
import React, { useState, useEffect, useCallback } from 'react';
import { contentService } from '../../../services/api';
import { Search, Eye, X, Filter, Download, Printer, FileText } from 'lucide-react';
import InvoiceGenerator from '../../../components/common/InvoiceGenerator';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage] = useState(15);
  const [currentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Ref to track orders without triggering dependency changes
  const ordersRef = React.useRef(orders);
  useEffect(() => { ordersRef.current = orders; }, [orders]);

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
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback mock data if API fails or is empty for dev
      if (ordersRef.current.length === 0) {
        const mockOrders = [
          { id: 'ORD-2024-001', buyerName: 'Rahul Kumar', totalAmount: 12500, status: 'Completed', paymentStatus: 'Payment Received', createdAt: '2024-12-10T10:00:00Z', items: [{ product: { name: 'Organic Ghee', id: 'P001' }, quantity: 2, price: 5000 }, { product: { name: 'Incense Sticks', id: 'P002' }, quantity: 5, price: 500 }] },
          { id: 'ORD-2024-002', buyerName: 'Sita Devi', totalAmount: 4500, status: 'Processing', paymentStatus: 'Payment Received', createdAt: '2024-12-11T11:00:00Z', items: [{ product: { name: 'Ayurvedic Soap', id: 'P003' }, quantity: 10, price: 450 }] }
        ];
        setDisplayedOrders(mockOrders);
        setOrders(mockOrders);
      }
    } finally {
      setLoading(false);
    }
  }, [entriesPerPage, currentPage, statusFilter, paymentFilter, searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-amber-100 text-amber-700';
      case 'Pending': return 'bg-gray-100 text-gray-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c2d50] to-[#EA580C] px-8 py-12 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Order Management
          </h1>
          <p className="text-blue-100 opacity-90">
            View and manage customer orders, track status, and generate invoices.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full -mt-8">

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Filters */}
          <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Order ID or Buyer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white text-sm"
              >
                <option value="All">All Payment</option>
                <option value="Payment Received">Payment Received</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <button
              onClick={fetchOrders}
              className="bg-[#0c2d50] hover:bg-[#0a2340] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Refresh List
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Payment</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">Loading orders...</td></tr>
                ) : displayedOrders.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No orders found.</td></tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr key={order.id || order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.orderNumber || (order.id || order.id).substring(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm">{order.buyerName || order.user?.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{order.buyerEmail || order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">{order.items?.length || 0}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                                    ${order.paymentStatus === 'Payment Received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
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

      {/* Invoice Modal via InvoiceGenerator */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col animate-fade-in font-sans relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors z-20">
              <X size={24} />
            </button>
            <InvoiceGenerator order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
