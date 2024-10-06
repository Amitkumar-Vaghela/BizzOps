import { faPencil, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

function Account() {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [business, setBusiness] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    fetch

    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    const handleOpenPopup = () => {
        setPopupVisible(true);
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
                    <div className="bg-white rounded-3xl p-6">
                        <h2 className="text-sm font-semibold text-center">Account</h2>
                        <h2 className="text-lg font-bold text-center m-4">Business Name</h2>
                        <p className="mt-2 text-center m-2">business@business.com</p>
                        <p className="mt-2 text-center m-2 mb-10">Name</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={handleClosePopup}
                                className="bg-gray-500 text-white px-2 py-1 rounded-full"
                            >
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
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

export default Account;
