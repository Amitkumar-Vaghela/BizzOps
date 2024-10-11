import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NoteTable() {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/notes/get-notes', { withCredentials: true });
            if (response.data.statusCode === 200) {
                setNotes(response.data.data.notes);
            }
        } catch (error) {
            console.error("Error while fetching notes", error.response?.data || error.message);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/notes/delete-notes', 
                { noteId }, 
                { withCredentials: true }
            );
            if (response.data.statusCode === 200) {
                closeModal();
                setNotes(notes.filter(note => note._id !== noteId));
            }
        } catch (error) {
            console.error("Error while deleting note", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    const openModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    return (
        <div className="w-full rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Notes </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.length > 0 ? (
                    notes.map((noteItem) => (
                        <div key={noteItem._id} className="bg-white shadow-md hover:bg-blue-200 transition-all duration-200 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h1 className="text-lg m-2 mb-3 font-font4 font-semibold text-gray-900">{noteItem.title}</h1>
                                <p className="text-sm m-2 text-black font-font4">{noteItem.content.slice(0, 30)} . . .</p>
                            </div>
                            <FontAwesomeIcon
                                className="text-black hover:text-gray-400 cursor-pointer"
                                icon={faEllipsis}
                                onClick={() => openModal(noteItem)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full font-font4 text-center py-4 text-gray-600">
                        No notes available.
                    </div>
                )}
            </div>

            {isModalOpen && selectedNote && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h2 className="text-2xl font-semibold mb-4 font-font4">Note Details</h2>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-font4">{selectedNote.title}</h3>
                            <p className="text-gray-600 font-font4">{selectedNote.content}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-blue-500 m-2 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-font4"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-red-500 m-2 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-font4"
                                onClick={() => deleteNote(selectedNote._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoteTable;