import axios from "axios";
import React from "react";
import { useState } from "react";

function AddOrders() {
    const [item, setItem] = useState('')
    const [qty, setQty] = useState(null)
    const [price, setPrice] = useState('')
    const [dateToDilivery, setDateToDilivery] = useState('')
    const [profitInPercent, setProfitInPercent] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddOrders = async (e) => {
        e.preventDefault()
        const data = { item, qty, price, dateToDilivery, profitInPercent }
        try {
            const response = await axios.post('http://localhost:8000/api/v1/orders/add-order', data, { withCredentials: true })
            if (response.data.statusCode === 201) {
                console.log("expense added successfully");
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
            <form onSubmit={handleAddOrders} className="space-y-4 mb-2">
                <input
                    type="text"
                    placeholder="Item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    required
                    className="w-1/5 text-center bg-gray-200 h-10 m-2 rounded-2xl font-font4 font-light "
                />

                <input
                    type="number"
                    placeholder="Qty"
                    value={expAmount}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="w-1/11 text-center h-10 m-2 bg-gray-200 rounded-2xl  font-font4 font-light"
                />

                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-1/5 text-center h-10 m-2 rounded-2xl bg-gray-200  font-font4 font-light"
                />

                <input
                    type="date"
                    value={dateToDilivery}
                    onChange={(e) => setDateToDilivery(e.target.value)}
                    required
                    className="w-1/11 text-center pr-4 h-10 m-2 rounded-2xl  bg-gray-200 font-font4 font-light"
                />

                <input
                    type="number"
                    value={profitInPercent}
                    onChange={(e) => setProfitInPercent(e.target.value)}
                    required
                    className="w-1/11 text-center pr-4 h-10 m-2 rounded-2xl  bg-gray-200 font-font4 font-light"
                />

                <button type="submit" className="bg-blue-300 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Expense</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-bold">Success!</h2>
                        <p className="mt-2">Order added successfully.</p>
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


export default AddOrders