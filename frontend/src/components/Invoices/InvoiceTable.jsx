import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/invoice/get-invoice', { withCredentials: true });
                setInvoices(response.data.data.invoice);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-semibold mb-6 text-center">Invoices</h1>
                <table className="w-full table-auto text-left border border-gray-200">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="border p-4">Customer Name</th>
                            <th className="border p-4">Items</th>
                            <th className="border p-4 text-right">Subtotal</th>
                            <th className="border p-4 text-right">Grand Total</th>
                            <th className="border p-4 text-center">Paid</th>
                            <th className="border p-4 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <React.Fragment key={invoice._id}>
                                <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-50">
                                    <td className="border p-4">{invoice.name}</td>
                                    <td className="border p-4">
                                        <table className="w-full">
                                            <thead className="bg-blue-50">
                                                <tr>
                                                    <th className="border p-2">Item Name</th>
                                                    <th className="border p-2 text-right">Qty</th>
                                                    <th className="border p-2 text-right">Price</th>
                                                    <th className="border p-2 text-right">Tax (%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoice.items.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="border p-2">{item.itemName}</td>
                                                        <td className="border p-2 text-right">{item.qty}</td>
                                                        <td className="border p-2 text-right">₹{item.price}</td>
                                                        <td className="border p-2 text-right">{item.tax}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="border p-4 text-right">₹{invoice.subTotal.toFixed(2)}</td>
                                    <td className="border p-4 text-right">₹{invoice.grandTotal.toFixed(2)}</td>
                                    <td className="border p-4 text-center">{invoice.paid ? 'Yes' : 'No'}</td>
                                    <td className="border p-4 text-center">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;
