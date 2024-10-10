import axios from "axios";
import React from "react";
import { useState } from "react";

function AddCustomers() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(null);
    const [city, setCity] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddCustomer = async (e) => {
        e.preventDefault()
        const data = { name, email, phone, city }
        try {
            const response = await axios.post('http://localhost:8000/api/v1/customer/add-customer', data, { withCredentials: true })
            if (response.data.statusCode === 200) {
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error while adding customer", error.response?.data || error.message);
        }
    }
    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    return (
        <>
            <form onSubmit={handleAddCustomer} className="space-y-4 mb-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-1/5 text-center bg-gray-200 h-10 m-2 rounded-2xl font-font4 font-light "
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-1/11 text-center h-10 m-2 bg-gray-200 rounded-2xl  font-font4 font-light"
                />

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-1/5 text-center h-10 m-2 rounded-2xl bg-gray-200  font-font4 font-light"
                />

                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => city(e.target.value)}
                    required
                    className="w-1/12 text-center pl-4 h-10 m-2 rounded-2xl bg-gray-200 font-font4 font-light"
                />
                <button type="submit" className="bg-blue-300 h-10 m-2 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Order</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p className="mt-2">Customer added successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default AddCustomers