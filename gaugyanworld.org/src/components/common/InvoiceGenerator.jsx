import React from 'react';
import { Download, Printer } from 'lucide-react';
import Button from '../Button';

// Helper to calculate tax
const calculateTax = (amount, rate = 18) => {
    const tax = (amount * rate) / (100 + rate);
    const base = amount - tax;
    return { base: base.toFixed(2), tax: tax.toFixed(2) };
};

// Helper for number to words (simple version)
const numberToWords = (amount) => {
    return amount.toString(); // TODO: Implement full conversion library if needed
};

const InvoiceGenerator = ({ order, type = 'print' }) => {
    if (!order) return null;

    const seller = order.sellerSnapshot || {
        name: 'Gaugyan World',
        address: 'Example Address, India',
        gst: 'N/A'
    };

    const buyer = order.user || { name: 'Guest' };
    const billing = order.shippingAddress || {}; // Fallback if no billing

    const invoiceDate = order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString() : new Date().toLocaleDateString();

    // Default 18% GST assumed for now, ideally per product
    const taxBreakup = calculateTax(order.totalPrice || 0);

    const InvoiceLayout = () => (
        <div id="printable-invoice" className="bg-white p-8 max-w-4xl mx-auto border shadow-sm print:shadow-none print:border-none text-black">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">TAX INVOICE</h1>
                    <p className="text-sm text-gray-600">Original for Recipient</p>
                    <div className="mt-4">
                        <h3 className="font-bold">{seller.shopName || seller.name || 'Gaugyan Seller'}</h3>
                        <p className="text-sm max-w-xs">{seller.shopAddress || seller.address}</p>
                        <p className="text-sm">GSTIN: <span className="font-bold">{seller.gstNumber || 'N/A'}</span></p>
                        <p className="text-sm">PAN: <span className="font-bold">{seller.panNumber || 'N/A'}</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <img src="/gaugyan-logo.png" alt="Gaugyan" className="h-12 ml-auto mb-4" />
                    <div className="text-sm">
                        <p><strong>Invoice No:</strong> {order.invoiceNumber || `INV-${order.id}`}</p>
                        <p><strong>Date:</strong> {invoiceDate}</p>
                        <p><strong>Order ID:</strong> #{order.id}</p>
                    </div>
                </div>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h4 className="font-bold text-gray-700 mb-2">Billed To:</h4>
                    <p className="font-semibold">{buyer.name}</p>
                    <p className="text-sm">{billing.address}</p>
                    <p className="text-sm">{billing.city}, {billing.state} - {billing.postalCode}</p>
                    <p className="text-sm">Phone: {billing.phone || buyer.mobile || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-700 mb-2">Shipped To:</h4>
                    <p className="font-semibold">{buyer.name}</p>
                    <p className="text-sm">{order.shippingAddress?.address}</p>
                    <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase">
                        <th className="p-3">#</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">HSN/SAC</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Rate</th>
                        <th className="p-3 text-right">Taxable</th>
                        <th className="p-3 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {order.orderItems?.map((item, i) => (
                        <tr key={i} className="border-b">
                            <td className="p-3">{i + 1}</td>
                            <td className="p-3">
                                <span className="font-medium">{item.name}</span>
                                {item.variant && <span className="text-xs block text-gray-500">{item.variant}</span>}
                            </td>
                            <td className="p-3">8517</td> {/* Mock HSN */}
                            <td className="p-3 text-right">{item.qty}</td>
                            <td className="p-3 text-right">₹{item.price}</td>
                            <td className="p-3 text-right">₹{(item.price * item.qty * 0.82).toFixed(2)}</td>
                            <td className="p-3 text-right">₹{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-64">
                    <div className="flex justify-between py-2 border-b text-sm">
                        <span>Taxable Amount</span>
                        <span>₹{taxBreakup.base}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-sm">
                        <span>CGST (9%)</span>
                        <span>₹{(taxBreakup.tax / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-sm">
                        <span>SGST (9%)</span>
                        <span>₹{(taxBreakup.tax / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b text-sm">
                        <span>Shipping</span>
                        <span>₹{order.shippingPrice || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-black font-bold text-lg mt-2">
                        <span>Grand Total</span>
                        <span>₹{order.totalPrice}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-xs text-gray-500">
                <p>1. Interest @ 18% p.a. will be charged if payment is not made within the due date.</p>
                <p>2. Goods once sold will not be taken back.</p>
                <p>3. Subject to local jurisdiction only.</p>
                <div className="mt-8 text-right">
                    <p className="font-bold">For {seller.shopName || 'Gaugyan World'}</p>
                    <div className="h-16"></div>
                    <p>(Authorized Signatory)</p>
                </div>
            </div>
        </div>
    );

    const handlePrint = () => {
        const printContent = document.getElementById('printable-invoice').innerHTML;
        const win = window.open('', '', 'height=700,width=800');
        win.document.write('<html><head><title>Invoice</title>');
        win.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'); // Use external for print window
        win.document.write('</head><body >');
        win.document.write(printContent);
        win.document.write('</body></html>');
        win.document.close();
        // Wait for style to load
        setTimeout(() => {
            win.print();
        }, 1000);
    };

    if (type === 'button') {
        return <Button onClick={handlePrint} className="flex gap-2 items-center text-sm px-3 py-1"><Printer size={14} /> Invoice</Button>;
    }

    return <InvoiceLayout />;
};

export default InvoiceGenerator;
