import { faPencil, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'

function Account() {
    const navigate = useNavigate()
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isEditPopupVisible, setEditPopupVisible] = useState(false);
    const [business, setBusiness] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [newBusiness, setNewBusiness] = useState(business);
    const [newEmail, setNewEmail] = useState(email);
    const [newName, setNewName] = useState(name);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/users/get-details', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setBusiness(response.data.data.businessName);
                setEmail(response.data.data.email);
                setName(response.data.data.name);
            }
        } catch (error) {
            console.error("Error while fetching data", error.response?.data || error.message);
        }
    };

    const handleEditAccount = async (e) => {
        e.preventDefault();
        
        if (!newBusiness || !newEmail || !newName) {
            console.error("All fields are required");
            return;
        }
    
        try {
            const data = {
                businessName: newBusiness,
                email: newEmail,
                name: newName
            };
            
            const response = await axios.post(
                'http://localhost:8000/api/v1/users/update-account',
                data,
                { withCredentials: true }
            );
    
            if (response.data.statusCode === 200) {
                console.log("Details updated successfully");
                handleClosePopup();
                handleEditClose();
            } else {
                console.error("Error updating account", response.data.message);
            }
        } catch (error) {
            console.error("Error while updating account", error.response?.data || error.message);
        }
    };

    const handleLogOut = async()=>{
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/logout',{},{withCredentials:true})
            if(response.data.statusCode === 200){
                console.log("usert logged out");
                navigate('/')
            }
        } catch (error) {
            console.error("error while logging out" || error.message);
        }
    }
    

    useEffect(() => {
        fetchData();
    }, []);

    const handleClosePopup = () => {
        setPopupVisible(false);
    };

    const handleOpenPopup = () => {
        setPopupVisible(true);
    };

    const handleEditOpen = () => {
        setEditPopupVisible(true);
    };

    const handleEditClose = () => {
        setEditPopupVisible(false);
        window.location.reload();
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
                        <h2 className="text-lg font-bold text-center m-4">{business}</h2>
                        <p className="mt-2 text-center m-2">{email}</p>
                        <p className="mt-2 text-center m-2 mb-10">{name}</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => { handleEditOpen(); handleClosePopup(); }}
                                className="bg-gray-500 text-white px-2 py-1 rounded-full"
                            >
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 text-white px-2 py-1 font-font4  rounded"
                            >
                                Close
                            </button>
                            <button 
                                onClick={handleLogOut}
                                className="bg-red-500 text-xs text-white px-2 py-1 font-font4 rounded"
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
                                value={newBusiness}
                                onChange={(e) => setNewBusiness(e.target.value)}
                                className="w-full text-sm p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full p-3 text-sm pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                            />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
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
