import React from "react";
import PaymentTable from "./PaymentTable";
import Sidebar from "../Sidebar";
import CustomBtn from "../CustomBtn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDollar, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Account from "../Account.jsx";

function Payment() {

    const [paid, setPaid] = useState(0)
    const [unPaid, setUnPaid] = useState(0)
    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/invoice/paid-invoice', { withCredentials: true });
            setPaid(response.data.data.totalPaidAmount)
            const unpaidResponse = await axios.get('http://localhost:8000/api/v1/invoice/unpaid-invoice', { withCredentials: true })
            setUnPaid(unpaidResponse.data.data.totalUnpaidAmount)
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className=" overflow-y-auto h-[calc(100vh)] sm:w-5/6 bg-[#141415]">
                    <CustomBtn />
                    <Account />
                    <h1 className="sm:m-10 m-4 mt-20 text-2xl text-white font-medium font-poppins"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={() => navigate('/dashboard')} /> Payments</h1>
                    <div className="justify-center items-center flex flex-col">
                        <div className="w-4/5">
                            <div className="mt-2 m-9 sm:flex sm:justify-center sm:items-center sm:gap-4">
                                <div className="h-full sm:w-1/5 w-5/6 m-6">
                                    <div className="bg-zinc-700 w-full h-24 shadow-lg rounded-2xl flex flex-col items-center">
                                        <div className="w-full bg-[#232325] shadow-lg h-16  rounded-t-xl">
                                            <p className="text-base text-white font-light font-poppins mt-1 ml-2"> <FontAwesomeIcon icon={faDollar} className="text-sm pr-3 text-green-600" />Paid Payments</p>
                                            <h1 className="text-white mb-1 text-2xl font-medium font-poppins ml-2">₹ {paid.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                        </div>
                                        <div className="w-11/12 mt-1 ml-">
                                            <p className="font-normal text-white mt-1 font-poppins text-xs">From All Time</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full sm:w-1/5 w-5/6 m-6">
                                    <div className="bg-zinc-700 w-full h-24 shadow-lg rounded-2xl flex flex-col items-center">
                                        <div className="w-full bg-[#232325] shadow-lg h-16  rounded-t-xl">
                                            <p className="text-base text-white font-light font-poppins mt-1 ml-2"> <FontAwesomeIcon icon={faMoneyBill} className="text-sm pr-3 text-red-400" />Unpaid Payments</p>
                                            <h1 className="text-white mb-1 text-2xl font-medium font-poppins ml-2">₹ {unPaid.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                        </div>
                                        <div className="w-11/12 mt-1 ml-">
                                            <p className="font-normal mt-1 font-poppins text-xs text-white">From All Time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="m-5 w-5/6"><PaymentTable /></div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Payment