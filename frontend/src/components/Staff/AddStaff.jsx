import React, { useState } from "react";
import axios from "axios";

function AddStaff({ onStaffAdded }) {
    const [name, setName] = useState('');
    const [salary, setSalary] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        const data = { 
            name, 
            email, 
            phone, 
            salary: Number(salary),
            debitCreditHistory: Number(salary)
        };
        try {
            const response = await axios.post('http://localhost:8000/api/v1/staff/add-staff', data, { withCredentials: true });
            if (response.data.statusCode === 200) {
                onStaffAdded(response.data.data);
                setPopupVisible(true);
                resetForm();
            }
        } catch (error) {
            console.error("Error while adding staff", error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setName('');
        setSalary('');
        setEmail('');
        setPhone('');
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload()
    };

    return (
        <>
            <form onSubmit={handleAddStaff} className="space-y-4 mb-2">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-1/5 text-center bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl font-font4 font-light"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-1/11 text-center h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl font-font4 font-light"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-1/5 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-light"
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    className="w-2/12 text-center pl-4 h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-light"
                />
                <button type="submit" className="bg-blue-300 h-10 m-2 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">
                    Add Staff
                </button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p className="mt-2">Staff added successfully.</p>
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
    );
}

export default AddStaff;