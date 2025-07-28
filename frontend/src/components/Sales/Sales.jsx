import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SalesTable from "./SalesTable.jsx";
import AddSales from "./AddSales.jsx";
import SalesRAGComponent from "./SalesRAGComponents..jsx";
import Sidebar from '../Sidebar.jsx';
import CustomBtn from "../CustomBtn.jsx";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Account from "../Account.jsx";

function Sales() {
    const navigate = useNavigate()
    const [sales, setSales] = useState([]);

    const fetchSales = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/sales/get-sale?timeFilter=alltime`, { withCredentials: true });
            if (response.data.success) {
                setSales(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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
            <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] sm:w-5/6 bg-[#141415]">
                <CustomBtn />
                <Account />
                <SalesRAGComponent />
                <h1 className="sm:m-10 m-4 mt-20 text-2xl font-medium font-poppins flex items-center text-white"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={()=> navigate('/dashboard')} /> Sales</h1>
                <div className="justify-center items-center flex flex-col">
                    <div className="w-5/6 bg-[#28282B] rounded-xl">
                        <h1 className="ml-4 mt-2  text-white font-semibold font-poppins">Add Sales</h1>
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