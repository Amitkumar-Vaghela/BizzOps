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
            <form onSubmit={handleAddStaff} className="space-y-4 sm:mb-2 mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="sm:w-1/5  text-center bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl font-poppins font-normal text-white"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="sm:w-auto w-5/6 text-center h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl font-poppins font-normal text-white"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="sm:w-1/5 w-2/4 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl font-poppins font-normal text-white"
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    className="sm:w-2/12 w-2/5 text-center pl-4 h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl font-poppins font-normal text-white"
                />
                <button type="submit" className="bg-white shadow-xl h-9 w-1/4 m-4 hover:bg-blue-200 text-black sm:w-1/12 rounded-xl">
                    Add Staff
                </button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm sm:w-full w-4/5">
                        <h2 className="text-lg font-poppins text-white font-bold">Success!</h2>
                        <p className="mt-2 font-poppins text-white">Staff added successfully.</p>
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
    );
}

export default AddStaff;