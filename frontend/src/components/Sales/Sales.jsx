import React, { useState, useEffect, useCallback } from "react";
import SalesTable from "./SalesTable.jsx";
import AddSales from "./AddSales.jsx";
import Sidebar from '../Sidebar.jsx';
import CustomBtn from "../CustomBtn.jsx";
import axios from 'axios';

function Sales() {
    const [sales, setSales] = useState([]);

    const fetchSales = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/sales/get-sale?timeFilter=alltime', { withCredentials: true });
            if (response.data.success) {
                setSales(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        }
    }, []);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const addNewSale = useCallback((newSale) => {
        setSales(prevSales => [newSale, ...prevSales]);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-400">
                <CustomBtn />
                <h1 className="m-10 text-2xl font-medium font-font4">Sales</h1>
                <div className="justify-center items-center flex flex-col">
                    <div className="w-5/6 bg-white rounded-xl">
                        <h1 className="ml-4 mt-2 text-xl font-light font-font4">Add Sales</h1>
                        <AddSales addNewSale={addNewSale} />
                    </div>
                    <div className="m-5 w-5/6">
                        <SalesTable sales={sales} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sales;