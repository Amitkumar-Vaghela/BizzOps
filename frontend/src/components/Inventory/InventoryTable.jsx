import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpAZ, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function InventoryTable({ inventoryItems, onUpdateInventory }) {
    const [newQty, setNewQty] = useState(0);
    const [action, setAction] = useState("");
    const [product, setProduct] = useState("");
    const [localInventory, setLocalInventory] = useState(inventoryItems);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    useEffect(() => {
        setLocalInventory(inventoryItems);
    }, [inventoryItems]);

    const deleteInventory = async (itemId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/inventory/delete-item', { product: itemId }, { withCredentials: true });
            if (response.status === 200) {
                console.log("Deleted");
                setLocalInventory((prevItems) => prevItems.filter(item => item._id !== itemId));
                handleClosePopup(); // Close the popup after deletion
            }
        } catch (error) {
            console.error("Error deleting inventory item:", error);
        }
    };

    const handleStockClick = (itemId, actionType) => {
        setProduct(itemId);
        setNewQty(0);
        setAction(actionType);
    };

    const handleClosePopup = () => {
        setNewQty(0);
        setProduct("");
        setAction("");
        setPopupVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdateInventory(action, product, parseInt(newQty));
        
        // Update local state immediately for responsive UI
        setLocalInventory((prevItems) => 
            prevItems.map(item => 
                item._id === product
                    ? { 
                        ...item, 
                        stockRemain: action === "add"
                            ? Number(item.stockRemain) + Number(newQty)
                            : Number(item.stockRemain) - Number(newQty) 
                      }
                    : item
            )
        );
        
        handleClosePopup();
    };

    const confirmDelete = (itemId) => {
        setDeleteItemId(itemId);
        setPopupVisible(true);
    };

    const handleDelete = () => {
        if (deleteItemId) {
            deleteInventory(deleteItemId);
        }
    };

    return (
        <>
            <Card className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
                <Typography variant="p" color="blue-gray" className="mb-4 text-white font-poppins font-semibold">
                    Inventory Records
                </Typography>
                <div className="overflow-x-auto">
                    <table className="min-w-full ">
                        <thead>
                            <tr className="bg-zinc-900">
                                <th className="px-4 py-2 text-white font-poppins">Item</th>
                                <th className="px-4 py-2 text-white font-poppins">Category</th>
                                <th className="px-4 py-2 text-white font-poppins">Stock In</th>
                                <th className="px-4 py-2 text-white font-poppins">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localInventory.length > 0 ? (
                                localInventory.map((inventory) => (
                                    <tr key={inventory._id} className="text-center">
                                        <td className="px-4 py-2 text-white text-sm font-medium font-poppins">{inventory.item}</td>
                                        <td className="px-4 py-2 text-white text-sm font-medium font-poppins">{inventory.category}</td>
                                        <td className="px-4 py-2 text-white text-sm font-poppins font-bold">
                                            {inventory.stockRemain || 'N/A'}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleStockClick(inventory._id, "add")}
                                                className="bg-blue-400 pt-2 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                            <button
                                                onClick={() => handleStockClick(inventory._id, "remove")}
                                                className="bg-violet-400 pt-2 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-violet-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(inventory._id)}
                                                className="bg-red-500 pt-2 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-red-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
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

            {action && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white font-poppins p-6 w-1/4 rounded-2xl shadow-lg">
                        <h2 className="text-lg font-poppins font-medium mb-4">
                            {action === "add" ? "+ Add Stock" : "- Remove Stock"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
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
                                    className="bg-blue-100 text-black px-4 py-2 rounded-2xl mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-400 text-white px-4 py-2 rounded-2xl"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white font-poppins p-6 w-1/4 rounded-2xl shadow-lg">
                        <h2 className="text-lg font-poppins font-medium mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={handleClosePopup}
                                className="bg-blue-100 text-black px-4 py-2 rounded-2xl mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-2xl"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default InventoryTable;
