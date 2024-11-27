import axios from "axios";
import React from "react";
import { useState } from "react";
const token = localStorage.getItem('accessToken');

function AddNote() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddNote = async (e) => {
        e.preventDefault()
        const data = { title, content }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/notes/add-notes`, data, { headers:{'Authorization':token},withCredentials: true })
            if (response.data.statusCode === 200) {
                console.log("Note added successfully");
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error while adding expense", error.response?.data || error.message);
        }
    }
    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    return (
        <>
            <form onSubmit={handleAddNote} className="w-full space-y-4 sm:mb-2 mb-4 mt-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="sm:w-1/4 w-3/4 text-center text-white bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl font-font4 font-normal "
                />

                <input
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="sm:w-2/4 w-4/5 text-center text-white h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl  font-font4 font-normal"
                />
                <button type="submit" className="bg-white h-10 m-4 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Note</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm sm:w-full w-4/5">
                        <h2 className="text-lg text-white font-bold font-poppins">Success!</h2>
                        <p className="mt-2 text-white font-poppins">Note added successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClosePopup}
                                className="font-poppins font-semibold text-white"
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


export default AddNote