import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CustomerTable() {
    const [customers, setCustomers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/customer/get-customer', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setCustomers(response.data.data.customers);
            }
        } catch (error) {
            console.error("Error while fetching customers", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-base font-font4 font-semibold mb-4 text-gray-800">Customers Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2 border font-font4">Name</th>
                            <th className="px-4 py-2 border font-font4">Email</th>
                            <th className="px-4 py-2 border font-font4">Phone</th>
                            <th className="px-4 py-2 border font-font4">City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer._id} className="border-b">
                                    <td className="px-4 py-2 border text-sm font-font4">{customer.name}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{customer.email}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{customer.phone}</td>
                                    <td className="px-4 py-2 border text-sm font-font4">{customer.city}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-font4">
                                    No order data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}

export default CustomerTable;
