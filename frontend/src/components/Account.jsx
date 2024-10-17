import { faPencil, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
const token = localStorage.getItem('accessToken');

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
            const response = await axios.get('https://bizzops.onrender.com/api/v1/users/get-details', {headers:{'Authorization': token}, withCredentials: true });
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
                'https://bizzops.onrender.com/api/v1/users/update-account',
                newDetails,
                { headers:{
                    'Authorization':token
                },withCredentials: true }
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
            const response = await axios.post('https://bizzops.onrender.com/api/v1/users/logout', {}, { headers:{'Authorization':token},withCredentials: true });
            if (response.data.statusCode === 200) {
                console.log("User logged out");
                localStorage.removeItem('accessToken');
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
            <div className="absolute sm:top-5 sm:right-10 top-6 right-3">
                <button
                    onClick={handleOpenPopup}
                    className="sm:w-11 sm:h-11 h-10 w-10 sm:text-lg text-sm bg-gradient-to-r from-blue-300 text-center to-indigo-300 text-gray-700-400 font-normal font-poppins rounded-full hover:bg-gradient-to-bl transition"
                >
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </div>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] sm:w-2/12 w-3/4 rounded-3xl p-6">
                        <h2 className="text-sm text-white font-semibold text-center">Account</h2>
                        <h2 className="text-3xl text-white font-bold text-center m-4">{userDetails.businessName}</h2>
                        <p className="mt-2 text-center m-2 text-white text-lg">{userDetails.email}</p>
                        <p className="mt-2 text-center m-2 mb-10 text-white text-lg">{userDetails.name}</p>
                        {/* {message && <p className="text-red-500 text-center">{message}</p>} */}
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => { handleEditOpen(); handleClosePopup(); }}
                                className="text-white mr-10 sm:text-xs text-sm hover:text-gray-400"
                            >
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="text-blue-400 font-poppins font-semibold hover:text-blue-300"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleLogOut}
                                className="text-[#f84242] font-medium hover:text-[#b64141] font-poppins"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] sm:w-2/12 w-3/4 rounded-3xl p-6">
                        <h2 className="text-sm font-poppins text-white font-semibold text-center mb-5">Edit Account</h2>
                        <form onSubmit={handleEditAccount}>
                            <label className='pl-1 text-xs font-poppins text-zinc-500 font-thin m-2'>Business Name</label>
                            <input
                                type="text"
                                placeholder="Business Name"
                                required
                                value={newDetails.businessName}
                                onChange={(e) => setNewDetails({ ...newDetails, businessName: e.target.value })}
                                className="w-full text-sm p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal placeholder-gray-700 rounded-2xl"
                            />
                            <label className='pl-1 text-xs font-poppins text-zinc-500 font-thin m-2'>Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={newDetails.email}
                                onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}   
                                className="w-full text-sm p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal placeholder-gray-700 rounded-2xl"
                            />
                            <label className='pl-1 text-xs font-poppins text-zinc-500 font-thin m-2'>Name</label>
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={newDetails.name}
                                onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                                className="w-full text-sm p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal placeholder-gray-700 rounded-2xl"
                            />
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    type="submit"
                                    className="text-blue-400 hover:text-blue-300 font-poppins font-semibold "
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleEditClose}
                                    type="button"
                                    className="text-[#f84242] font-semibold hover:text-[#b64141] font-poppins"
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
