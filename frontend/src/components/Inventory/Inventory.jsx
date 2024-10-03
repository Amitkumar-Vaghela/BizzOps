import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddInventory from "./AddInventory.jsx";
import InventoryTable from "./InventoryTable.jsx";
import Sidebar from "../Sidebar.jsx";
import CustomBtn from "../CustomBtn.jsx";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Inventory() {
    const navigate = useNavigate()
    const [inventoryItems, setInventoryItems] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const isMounted = useRef(true);

    const fetchInventory = useCallback(async () => {
        if (!isMounted.current) return;
        try {
            const response = await axios.get('http://localhost:8000/api/v1/inventory/get-item', { withCredentials: true });
            if (response.status === 200 && response.data && response.data.data) {
                setInventoryItems(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
        return () => {
            isMounted.current = false;
        };
    }, [fetchInventory, updateTrigger]);

    const handleItemAdded = (newItem) => {
        setInventoryItems((prevItems) => [...prevItems, newItem]);
        setUpdateTrigger(prev => prev + 1);
    };

    const updateInventory = async (action, productId, quantity) => {
        try {
            const endpoint = action === "add"
                ? "http://localhost:8000/api/v1/inventory/add-stock"
                : "http://localhost:8000/api/v1/inventory/remove-stock";

            const response = await axios.post(
                endpoint,
                { product: productId, newQty: quantity },
                { withCredentials: true }
            );

            if (response.data.message === 200) {
                console.log(`Stock ${action}ed:`, { productId, quantity });
                // Trigger a re-fetch of the inventory
                setUpdateTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error(`Error ${action}ing stock:`, error);
        }
    };

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-200">
                    <CustomBtn />
                    <h1 className="m-10 text-2xl font-medium font-font4 flex items-center"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={()=> navigate('/dashboard')} /> Inventory</h1>
                    <div className="justify-center items-center flex flex-col">
                        <div className=" w-5/6 bg-white rounded-xl gap-4 mb-4">
                            <h1 className=" ml-4 mt-2 font-semibold font-font4">Add Item</h1>
                            <AddInventory onItemAdded={handleItemAdded} />
                        </div>

                        <div className="mt-2 m-9 w-5/6 flex justify-center items-center gap-4">
                            <InventoryTable inventoryItems={inventoryItems} onUpdateInventory={updateInventory} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Inventory;