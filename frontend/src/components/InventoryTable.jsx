import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

function InventoryTable({ inventoryItems, onAddStock, onRemoveStock }) {
    return (
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
                                    <td className=" border text-center">
                                        <button
                                            onClick={() => onAddStock(inventory._id)}
                                            className="bg-blue-200 pt-2 text-black text-xs font-font4 font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                        >
                                            <FontAwesomeIcon icon={faPlus}/>
                                        </button>
                                        <button
                                            onClick={() => onRemoveStock(inventory._id)}
                                            className="bg-blue-200 pt-2 text-black text-xs font-font4 font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center px-4 py-2 border">
                                    No inventory data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default InventoryTable;
