import axios from "axios";
import React from "react";
import { useState } from "react";

function AddOrders() {
    const [item, setItem] = useState('')
    const [qty, setQty] = useState('')
    const [price, setPrice] = useState('')
    const [dateToDilivery, setDateToDilivery] = useState('')
    const [profitInPercent, setProfitInPercent] = useState('')
    const [done, setDone] = useState(false)
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddOrders = async (e) => {
        e.preventDefault()
        const data = { item, qty, price, dateToDilivery, profitInPercent, done }
        try {
            const response = await axios.post('http://localhost:8000/api/v1/orders/add-order', data, { withCredentials: true })
            if (response.data.statusCode === 201) {
                console.log("expense added successfully");
                console.log(done);
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
                    className="w-1/5 text-center bg-[#2b2b2e] shadow-xl text-white h-10 m-2 rounded-2xl font-poppins font-normal "
                />

                <input
                    type="number"
                    placeholder="Qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="w-1/11 text-center h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl text-white font-poppins font-normal"
                />

                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-1/5 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal"
                />

                <input
                    type="number"
                    placeholder="Profit %"
                    value={profitInPercent}
                    onChange={(e) => setProfitInPercent(e.target.value)}
                    required
                    className="w-1/12 text-center pl-4 h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal"
                />
                <div className="flex flex-row">
                <div>
                        <label className="font-poppins text-white font-light m-2">Date to Delivery</label>
                        <input
                            type="date"
                            value={dateToDilivery}
                            onChange={(e) => setDateToDilivery(e.target.value)}
                            required
                            className="w-1/11 text-center pr-2 h-10 m-2 rounded-2xl  bg-[#2b2b2e] shadow-xl text-white font-poppins font-normal"
                        />
                        
                    </div>
                    <div className="w-2/11 flex justify-start items-center text-center h-10 m-2 p-2 rounded-xl bg-[#2b2b2e] shadow-xl font-poppins font-normal">
                        <input
                            type="checkbox"
                            className="w-3 h-3"
                            checked={done}  
                            onChange={(e) => setDone(e.target.checked)}
                        />
                        <label className='pl-1 text-sm font-poppins text-white font-normal'>Delivered</label>
                        
                    </div>
                    <button type="submit" className="bg-white shadow-xl h-10 m-2 hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Order</button>
                    
                </div>

            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-poppins text-white font-bold">Success!</h2>
                        <p className="mt-2 font-poppins text-white">Order added successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleClosePopup}
                                className="bg-blue-500 text-white font-poppins px-4 py-2 rounded"
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