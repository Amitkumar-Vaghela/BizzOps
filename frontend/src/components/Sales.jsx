import React, { useState, useEffect } from "react";
import AddSales from './AddSales.jsx';
import SalesTable from './SalesTable.jsx';
import Sidebar from './Sidebar.jsx';
import CustomBtn from "./CustomBtn.jsx";
import axios from 'axios';

function Sales() {
    const [sales, setSales] = useState([]);

    // Fetch sales data on component mount
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/sales/get-sale?timeFilter=alltime', { withCredentials: true });
                if (response.data.success) {
                    setSales(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch sales:', error);
            }
        };
        fetchSales();
    }, []);

    // Function to update sales after adding a sale
    const addNewSale = (newSale) => {
        setSales(prevSales => [newSale, ...prevSales]);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-400">
                <CustomBtn />
                <h1 className="m-10 text-2xl font-medium font-font4">Dashboard</h1>

                <div className="mt-2 m-9 gap-4">
                    {/* Pass addNewSale function to AddSales */}
                    <AddSales addNewSale={addNewSale} />
                    {/* Pass sales data to SalesTable */}
                    <SalesTable sales={sales} />
                </div>
            </div>
        </div>
    );
}

export default Sales;
