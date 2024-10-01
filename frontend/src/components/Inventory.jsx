import React, { useState, useEffect } from "react";
import axios from "axios";
import AddInventory from "./AddInventory.jsx";
import InventoryTable from "./InventoryTable.jsx";
import Sidebar from "./Sidebar.jsx";
import CustomBtn from "./CustomBtn.jsx";

function Inventory() {
    const [inventoryItems, setInventoryItems] = useState([]);

    // Fetch inventory items when component loads
    useEffect(() => {
        fetchInventory();
    }, []);

    // Function to fetch inventory items
    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/inventory/get-item', { withCredentials: true });
            console.log('Fetch inventory response:', response);

            if (response.status === 200 && response.data && response.data.data) {
                setInventoryItems(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        }
    };

    const handleItemAdded = (newItem) => {
        console.log('New item added:', newItem);
        setInventoryItems((prevItems) => [...prevItems, newItem]);
    };

    const updateInventory = (action, productId, quantity) => {
        setInventoryItems((prevItems) => {
            return prevItems.map(item => {
                if (item._id === productId) {
                    // Update stock based on action
                    const updatedStock = action === "add" ? item.stockRemain + quantity : item.stockRemain - quantity;
                    return { ...item, stockRemain: updatedStock };
                }
                return item;
            });
        });
    };

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-300">
                    <CustomBtn />
                    <h1 className="m-10 text-2xl font-medium font-font4">Inventory</h1>

                    <div className="mt-2 m-9 flex justify-center items-center gap-4">
                        <AddInventory onItemAdded={handleItemAdded} />
                    </div>

                    <div className="mt-2 m-9 flex justify-center items-center gap-4">
                        <InventoryTable inventoryItems={inventoryItems} onUpdateInventory={updateInventory} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Inventory;
