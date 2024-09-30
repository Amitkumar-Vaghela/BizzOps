import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";

function InventoryTable() {
    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/inventory/get-item', { withCredentials: true });
                if (response.status === 200) {
                    setInventoryItems(response.data.data);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            }
        };
        fetchInventory();
    }, []);

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
