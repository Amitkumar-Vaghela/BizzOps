import React from "react";
import { Card, Typography } from "@material-tailwind/react";

function InventoryTable({ inventoryItems }) {
    return (
        <Card className="bg-white shadow-md rounded-lg p-6">
            <Typography variant="h5" color="blue-gray" className="mb-4">
                Inventory Records
            </Typography>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 border">Item</th>
                            <th className="px-4 py-2 border">Category</th>
                            <th className="px-4 py-2 border">Stock In</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.length > 0 ? (
                            inventoryItems.map((inventory) => (
                                <tr key={inventory._id} className="border-b">
                                    <td className="px-4 py-2 border">{inventory.item}</td>
                                    <td className="px-4 py-2 border">{inventory.category}</td>
                                    <td className="px-4 py-2 border text-green-400 font-bold">{inventory.stockRemain || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center px-4 py-2 border">
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
