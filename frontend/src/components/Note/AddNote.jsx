import axios from "axios";
import React from "react";
import { useState } from "react";

function AddNote() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddNote = async (e) => {
        e.preventDefault()
        const data = { title, content }
        try {
            const response = await axios.post('http://localhost:8000/api/v1/notes/add-notes', data, { withCredentials: true })
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
            <form onSubmit={handleAddNote} className="space-y-4 mb-2">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-1/5 text-center text-white bg-[#343434] h-10 m-2 rounded-2xl font-font4 font-normal "
                />

                <input
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-2/4 text-center h-10 m-2 bg-gray-200 rounded-2xl  font-font4 font-light"
                />
                <button type="submit" className="bg-blue-300 h-10 m-2 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Note</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p className="mt-2">Note added successfully.</p>
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


export default AddNote