import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerTable() {
    const [customers, setCustomers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getCustomers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/get-customer`, { withCredentials: true });
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
        <div className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
            <h2 className="text-base font-poppins font-semibold mb-4 text-white">Customers Records</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-zinc-900">
                            <th className="px-4 py-2 text-white font-poppins">Name</th>
                            <th className="px-4 py-2 text-white font-poppins">Email</th>
                            <th className="px-4 py-2 text-white font-poppins">Phone</th>
                            <th className="px-4 py-2 text-white font-poppins">City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer._id} className="text-center   ">
                                    <td className="px-4 py-6 font-medium text-white text-sm font-poppins">{customer.name}</td>
                                    <td className="px-4 py-6 font-medium text-white text-sm font-poppins">{customer.email}</td>
                                    <td className="px-4 py-6 font-medium text-white text-sm font-poppins">{customer.phone}</td>
                                    <td className="px-4 py-6 font-medium text-white text-sm font-poppins">{customer.city}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center px-4 py-2 border font-poppins">
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
