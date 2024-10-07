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
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-200">
                    <CustomBtn />
                    <Account />
                    <h1 className="m-10 text-2xl font-medium font-font4 flex items-center"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={() => navigate('/dashboard')} /> Payments</h1>
                    <div className="justify-center items-center flex flex-col">
                        <div className="w-4/5">
                            <div className="mt-2 m-9 flex justify-center items-center gap-4">
                                <div className="h-full w-2/6 ">
                                    <div className="bg-white w-full h-24 shadow-lg rounded-2xl flex flex-col items-center">
                                        <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                            <p className="text-base text-black font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faDollar} className="text-sm pr-3 text-green-600" />Paid Payments</p>
                                            <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {paid.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                            <hr />
                                        </div>
                                        <div className="w-11/12 mt-1 ml-">
                                            <p className="font-normal mt-1 font-font4 text-xs">From All Time</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full w-2/6 ">
                                    <div className="bg-white w-full h-24 shadow-lg rounded-2xl flex flex-col items-center">
                                        <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                            <p className="text-base text-black font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faMoneyBill} className="text-sm pr-3 text-red-400" />Unpaid Payments</p>
                                            <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {unPaid.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                            <hr />
                                        </div>
                                        <div className="w-11/12 mt-1 ml-">
                                            <p className="font-normal mt-1 font-font4 text-xs">From All Time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-4/5"><PaymentTable /></div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Payment