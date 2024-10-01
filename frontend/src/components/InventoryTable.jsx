import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function InventoryTable({ inventoryItems, onUpdateInventory }) {
    const [newQty, setNewQty] = useState(0);
    const [action, setAction] = useState("");
    const [product, setProduct] = useState("");

    const handleStockClick = (itemId, actionType) => {
        setProduct(itemId);
        setNewQty(0); // Reset input
        setAction(actionType);
    };

    const handleClosePopup = () => {
        setNewQty(0);
        setProduct("");
        setAction("");
    };

    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        const data = { product, newQty };

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/inventory/add-stock",
                data,
                { withCredentials: true }
            );

            if (response.data.message === 200) {
                console.log("Stock added:", data);
                
                // Update inventoryItems state
                onUpdateInventory("add", product, newQty); // Call the parent function to update state
                handleClosePopup();
            }
        } catch (error) {
            console.error("Error adding stock:", error);
        }
    };

    const handleRemoveStockSubmit = async (e) => {
        e.preventDefault();
        const data = { product, newQty };

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/inventory/remove-stock",
                data,
                { withCredentials: true }
            );

            if (response.data.message === 200) {
                console.log("Stock removed:", data);
                
                // Update inventoryItems state
                onUpdateInventory("remove", product, newQty); // Call the parent function to update state
                handleClosePopup();
            }
        } catch (error) {
            console.error("Error removing stock:", error);
        }
    };

    return (
        <>
            <Card className="w-full bg-white shadow-md rounded-lg p-6">
                <Typography variant="h5" color="blue-gray" className="mb-4">
                    Inventory Records
                </Typography>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2 border font-font4">Item</th>
                                <th className="px-4 py-2 border font-font4">Category</th>
                                <th className="px-4 py-2 border font-font4">Stock In</th>
                                <th className="px-4 py-2 border font-font4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.length > 0 ? (
                                inventoryItems.map((inventory) => (
                                    <tr key={inventory._id} className="border-b">
                                        <td className="px-4 py-2 border font-font4">{inventory.item}</td>
                                        <td className="px-4 py-2 border font-font4">{inventory.category}</td>
                                        <td className="px-4 py-2 border text-black font-font4 font-bold">
                                            {inventory.stockRemain || 'N/A'}
                                        </td>
                                        <td className="border text-center">
                                            <button
                                                onClick={() => handleStockClick(inventory._id, "add")}
                                                className="bg-blue-200 pt-2 text-black text-xs font-font4 font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                            <button
                                                onClick={() => handleStockClick(inventory._id, "remove")}
                                                className="bg-blue-200 pt-2 text-black text-xs font-font4 font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No inventory items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add or Remove Stock Modal */}
            {action && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            {action === "add" ? "Add Stock" : "Remove Stock"}
                        </h2>
                        <form onSubmit={action === "add" ? handleAddStockSubmit : handleRemoveStockSubmit}>
                            <input
                                type="number"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                min="1"
                                placeholder="Quantity"
                                required
                                className="border rounded p-2 mb-4 w-full"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default InventoryTable;
