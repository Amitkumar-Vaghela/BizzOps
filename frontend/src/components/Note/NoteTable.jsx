import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NoteTable() {
    const [note, setNote] = useState([])

    const getNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/notes/get-notes', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setNote(response.data.data.notes);
                console.log(note);
                
            }
        } catch (error) {
            console.error("Error while fetching notes", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-base font-font4 font-semibold mb-4 text-gray-800">Notes Records</h2>
            <div className="overflow-x-auto">
                        {note.length > 0 ? (
                            note.map((noteItem) => (
                                <div key={noteItem._id} className="border-b">
                                    <div className='bg-blue-100'><h1>{noteItem.title}</h1></div>
                                </div>
                            ))
                        ) : (
                            <div>
                                <div className="text-center px-4 py-2 border font-font4">
                                    No order data available.
                                </div>
                            </div>
                        )}
            </div>
            {/* {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full relative">
                            <h2 className="text-lg font-font4 font-normal mb-4"># Order Details</h2>
                            <div>
                                <p className="text-sm font-font4 font-light mb-1"><strong>item:</strong> {selectedOrder.item}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Qty:</strong> ₹{selectedOrder.qty}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Date of Delivery:</strong> {new Date(selectedOrder.dateToDilivery).toLocaleDateString()}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Sale:</strong> ₹{selectedOrder.sale.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Profit:</strong> ₹{selectedOrder.profit.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1"><strong>Cost:</strong> ₹{selectedOrder.cost.toFixed(2)}</p>
                                <p className="text-sm font-font4 font-light mb-1 "><strong className='font-medium'>Status:</strong> {selectedOrder.paid ? 'Delivered' : 'Pending'}</p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-blue-500 font-font4 text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={toggleDoneStatus}
                                >
                                    {selectedOrder.done ? 'Mark as Pending' : 'Mark as Delivered'}
                                </button>
                                <button
                                    className="bg-gray-500 font-font4 text-sm text-white px-4 py-2 rounded-xl"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}
        </div>
    );
}

export default NoteTable;
