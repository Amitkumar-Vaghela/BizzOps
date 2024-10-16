import axios from "axios";
import React from "react";
import { useState } from "react";

function AddCustomers() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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
            <form onSubmit={handleAddCustomer} className="space-y-4 mt-3 sm:mb-2 mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="sm:w-1/5 w-4/5 text-center bg-[#2b2b2e] h-10 m-2 rounded-2xl font-poppins font-normal text-white shadow-xl "
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="sm:w-1/11 w-4/5 text-center h-10 m-2 bg-[#2b2b2e] rounded-2xl  font-poppins font-normal text-white shadow-xl"
                />

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="sm:w-1/5 w-3/6 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e]  font-poppins font-normal text-white shadow-xl"
                />

                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="sm:w-1/12 w-2/6 text-center pl-4 h-10 m-2 rounded-2xl bg-[#2b2b2e] font-poppins font-normal text-white shadow-xl"
                />
                    <button type="submit" className="bg-white h-10 m-2 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Customer</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm sm:w-full w-4/5">
                        <h2 className="text-lg font-poppins text-white font-bold">Success!</h2>
                        <p className="mt-2 font-poppins text-white">Customer added successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClosePopup}
                                className="text-blue-500 font-semibold hover:text-blue-300"
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