import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };

    const togglePaidStatus = async () => {
        if (!selectedInvoice) return;

        try {
            const updatedStatus = !selectedInvoice.paid; // Toggle the current paid status
            const response = await axios.put(`http://localhost:8000/api/v1/invoice/markPaidUnpaid/${selectedInvoice._id}`, {
                paid: updatedStatus
            }, { withCredentials: true });

            // Update the invoice list with the new paid status
            setInvoices((prevInvoices) =>
                prevInvoices.map((inv) =>
                    inv._id === selectedInvoice._id ? { ...inv, paid: updatedStatus } : inv
                )
            );
            setSelectedInvoice({ ...selectedInvoice, paid: updatedStatus });
        } catch (error) {
            console.error('Error updating paid status:', error);
        }
    };

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
                            <th className="border p-4 text-center">Action</th>
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
                                    <td>
                                        <FontAwesomeIcon
                                            className='text-gray-600 pl-8 hover:text-gray-300 cursor-pointer'
                                            icon={faEllipsis}
                                            onClick={() => openModal(invoice)}
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && selectedInvoice && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
                            <div>
                                <p><strong>Customer Name:</strong> {selectedInvoice.name}</p>
                                <p><strong>Date:</strong> {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                <p><strong>Subtotal:</strong> ₹{selectedInvoice.subTotal.toFixed(2)}</p>
                                <p><strong>Grand Total:</strong> ₹{selectedInvoice.grandTotal.toFixed(2)}</p>
                                <p><strong>Paid:</strong> {selectedInvoice.paid ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={togglePaidStatus}
                                >
                                    {selectedInvoice.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceTable;
