import { faPencil, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

function Account() {
    const {logout} = useAuth()
    const navigate = useNavigate();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isEditPopupVisible, setEditPopupVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        businessName: '',
        email: '',
        name: ''
    });
    const [newDetails, setNewDetails] = useState({ ...userDetails });
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/users/get-details', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setUserDetails(response.data.data);
                setNewDetails(response.data.data); // Initialize new details
            }
        } catch (error) {
            console.error("Error while fetching data", error.response?.data || error.message);
        }
    };

    const handleEditAccount = async (e) => {
        e.preventDefault();
        if (!newDetails.businessName || !newDetails.email || !newDetails.name) {
            setMessage("All fields are required");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/users/update-account',
                newDetails,
                { withCredentials: true }
            );

            if (response.data.statusCode === 200) {
                setMessage("Details updated successfully");
                setUserDetails(newDetails); // Update the displayed details
                handleEditClose(); // Close the edit popup
            } else {
                setMessage("Error updating account: " + response.data.message);
            }
        } catch (error) {
            setMessage("Error while updating account: " + (error.response?.data || error.message));
        }
    };

    const handleLogOut = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/logout', {}, { withCredentials: true });
            if (response.data.statusCode === 200) {
                console.log("User logged out");
                logout()
                navigate('/');
            }
        } catch (error) {
            console.error("Error while logging out", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClosePopup = () => {
        setPopupVisible(false);
        setMessage(''); // Clear message on close
    };

    const handleOpenPopup = () => {
        setPopupVisible(true);
    };

    const handleEditOpen = () => {
        setEditPopupVisible(true);
    };

    const handleEditClose = () => {
        setEditPopupVisible(false);
        setNewDetails(userDetails); // Reset new details
    };

    return (
        <>
            <div className="absolute top-5 right-10">
                <button
                    onClick={handleOpenPopup}
                    className="w-11 h-11 text-lg bg-gradient-to-r from-blue-300 text-center to-indigo-300 text-gray-700-400 font-normal font-poppins rounded-full hover:bg-gradient-to-bl transition"
                >
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </div>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-100 w-2/12 rounded-3xl p-6">
                        <h2 className="text-sm font-semibold text-center">Account</h2>
                        <h2 className="text-lg font-bold text-center m-4">{userDetails.businessName}</h2>
                        <p className="mt-2 text-center m-2">{userDetails.email}</p>
                        <p className="mt-2 text-center m-2 mb-10">{userDetails.name}</p>
                        {message && <p className="text-red-500 text-center">{message}</p>}
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => { handleEditOpen(); handleClosePopup(); }}
                                className="bg-gray-500 text-white px-2 py-1 rounded-full"
                            >
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 text-white px-2 py-1 font-poppins rounded"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleLogOut}
                                className="bg-red-500 text-xs text-white px-2 py-1 font-poppins rounded"
                            >
                                <FontAwesomeIcon icon={faSignOut} className="font-bold" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-100 w-2/12 rounded-3xl p-6">
                        <h2 className="text-sm font-semibold text-center mb-5">Edit Account</h2>
                        <form onSubmit={handleEditAccount}>
                            <input
                                type="text"
                                placeholder="Business Name"
                                required
                                value={newDetails.businessName}
                                onChange={(e) => setNewDetails({ ...newDetails, businessName: e.target.value })}
                                className="w-full text-sm p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={newDetails.email}
                                onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                                className="w-full p-3 text-sm pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={newDetails.name}
                                onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                                className="w-full p-3 pl-10 text-sm mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                            />
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-2 py-1 rounded-xl"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleEditClose}
                                    type="button"
                                    className="bg-gray-500 text-white px-2 py-1 rounded-xl"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Account;
