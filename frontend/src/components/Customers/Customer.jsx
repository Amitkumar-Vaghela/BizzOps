import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../Sidebar.jsx';
import CustomBtn from "../CustomBtn.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBackward } from "@fortawesome/free-solid-svg-icons";
import Account from "../Account.jsx";
import CustomerTable from "./CustomerTable.jsx";
import AddCustomers from "./AddCustomers.jsx";

function Customers(){
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-200">
                <CustomBtn />
                <Account />
                <h1 className="m-10 text-2xl font-medium font-font4 flex items-center"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={()=> navigate('/dashboard')} /> Customers</h1>
                <div className="justify-center items-center flex flex-col">
                    <div className="w-5/6 bg-white rounded-xl flex justify-center items-center">
                        <AddCustomers />
                    </div>
                    <div className="m-5 w-5/6">
                        <CustomerTable />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customers;