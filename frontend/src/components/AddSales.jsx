import axios from "axios";
import React, { useState, useEffect } from "react";

function AddSales() {
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [profitInPercent, setProfitInPercent] = useState("");
    const [qty, setQty] = useState("");
    const [date, setDate] = useState("");
    const [inventory, setInventory] = useState([]); // Store inventory items
    const [isPopupVisible, setPopupVisible] = useState(false); // Popup visibility state

    // Fetch inventory items on component mount
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/inventory/get-item', { withCredentials: true });
                setInventory(response.data.data); // Assuming the data comes under response.data.data
            } catch (error) {
                console.error('Failed to fetch inventory items:', error);
            }
        };
        fetchInventory();
    }, []);

    // Function to handle adding a new sale
    async function handleAddSales(e) {
        e.preventDefault();
        const data = { product, price, profitInPercent, qty, date };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/sales/add-sale', data, { withCredentials: true });

            if (response.status === 201) {
                console.log("Product added to sales");
                setPopupVisible(true); // Show popup
            }
            console.log(response.data.message);
            console.log(response.data.data);
        } catch (error) {
            console.error("Error while adding product", error.response?.data || error.message);
        }
    }

    // Function to close the popup
    const handleClosePopup = () => {
        setPopupVisible(false);
        // Optionally, reset form fields after closing the popup
        setProduct("");
        setPrice("");
        setProfitInPercent("");
        setQty("");
        setDate("");
    };

    return (
        <>
            <form onSubmit={handleAddSales} className="space-y-4">
                {/* Dropdown for selecting a product from inventory */}
                <select 
                    id="product" 
                    value={product} 
                    onChange={(e) => setProduct(e.target.value)} 
                    required
                    className="border rounded p-2 w-full"
                >
                    <option value="" disabled>Select a product</option>
                    {inventory.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.item} - {item.category} (Stock In: {item.stockRemain})
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Profit %"
                    value={profitInPercent}
                    onChange={(e) => setProfitInPercent(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Sale</button>
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

export default AddSales;
