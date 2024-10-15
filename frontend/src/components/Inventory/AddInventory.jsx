import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function AddInventory({ onItemAdded }) {
    const [item, setItem] = useState("");
    const [category, setCategory] = useState("");
    const [stockRemain, setStockRemain] = useState("");
    const [date, setDate] = useState("");
    const [isPopupVisible, setPopupVisible] = useState(false);

    async function handleAddInventory(e) {
        e.preventDefault(); 
        const data = { item, category, stockRemain, date };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/inventory/add-item', data, { withCredentials: true });
            
            if (response.status === 200 && response.data && response.data.data) {
                onItemAdded(response.data.data);  
                setPopupVisible(true); 
                // Clear form fields
                setItem("");
                setCategory("");
                setStockRemain("");
                setDate("");
            } else {
                console.error('Failed to add item:', response.data);
            }
        } catch (error) {
            console.error("Error while adding item:", error.response?.data || error.message);
        }
    }

    const handleClosePopup = () => {
        setPopupVisible(false);
    };
        
    return (
        <>
            <form onSubmit={handleAddInventory}>    
                <div className="sm:flex sm:gap-3 sm:mb-2 mb-4">
                    <input
                        type="text"
                        placeholder="Item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="sm:w-1/5 w-3/4 text-center font-normal bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="sm:w-1/5 text-center h-10 m-2 font-normal bg-[#2b2b2e] shadow-xl rounded-2xl text-white"
                        required
                    />
                    <input
                        type="number" 
                        placeholder="Add Stock"
                        value={stockRemain}
                        onChange={(e) => setStockRemain(e.target.value)}
                        className="sm:w-1/5 w-1/4 text-center h-10 m-2 rounded-2xl text-sm font-normal bg-[#2b2b2e] shadow-xl text-white"
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="sm:w-1/5 w-3/5 p-2 text-center h-10 m-2 rounded-2xl font-normal bg-[#2b2b2e] shadow-xl text-white"
                        required
                    />
                    <button 
                        type="submit" 
                        className="bg-white w-24 h-10 text-center text-sm m-2 font-poppins flex justify-center items-center rounded-xl hover:bg-blue-100 hover:text-black">
                        <FontAwesomeIcon icon={faPlus} className="text-xs pr-1" /> Add Item
                    </button>
                </div>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm sm:w-full w-4/5">
                        <h2 className="text-lg text-white font-poppins font-bold">Success!</h2>
                        <p className="mt-2 text-white font-poppins">Product added to inventory successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClosePopup}
                                className="text-blue-400 hover:text-blue-300 px-4 py-2 font-bold rounded"
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

export default AddInventory;
