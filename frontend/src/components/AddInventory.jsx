import React, { useState } from "react";
import axios from "axios";

function AddInventory() {
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

            if (response.status === 200) { 
                setPopupVisible(true); 
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error while adding item:", error.response?.data || error.message);
        }
    }

    return (
        <>
            <form onSubmit={handleAddInventory}>
                <input
                    type="text"
                    placeholder="Item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Add Stock"
                    value={stockRemain}
                    onChange={(e) => setStockRemain(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <button type="submit">Add Item</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p className="mt-2">Product added to sales successfully.</p>
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
    );
}

export default AddInventory;
