import React from "react";
import Sidebar from "./Sidebar";
import CustomBtn from "./CustomBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
    const totalSale = 123444;
    const sale = 123;

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="w-5/6 bg-white mt-3 mr-3 mb-3 rounded-2xl">
                    <CustomBtn />
                    <h1 className="m-10 text-2xl font-medium font-poppins">Dashboard</h1>
                    <div className="mt-2 flex justify-center items-center gap-4">
                        <div className="bg-slate-700 w-1/4 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-[#212425] h-16  rounded-t-xl">
                                <p className="text-base text-white font-light font-poppin mt-1 ml-2">Total Sales</p>
                                <h1 className="text-white text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                {/* <hr /> */}
                                <p className="font-thin mt-1 text-white font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-l from-blue-100 to-indigo-200 w-1/4 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-base font-light font-poppin mt-1 ml-2">Total Profit</p>
                                <h1 className="text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-l from-blue-100 to-indigo-200 w-1/4 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-base font-light font-poppin mt-1 ml-2">Total Cost</p>
                                <h1 className="text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center items-center gap-5">
                        <div className="bg-slate-700 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-black h-16  rounded-t-xl">
                                <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                            </div>
                        </div>
                        <div className="bg-slate-700 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-black h-16  rounded-t-xl">
                                <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-white font-poppins text-xs">Past 30 Day's Sale</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-r from-blue-50 to-indigo-200 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-xs fon-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-r from-blue-50 to-indigo-200 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-xs fon-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-r from-blue-50 to-indigo-200 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-xs fon-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>
                        <div className=" border-r-2 bg-gradient-to-r from-blue-50 to-indigo-200 w-32 h-24 rounded-xl flex flex-col items-center">
                            <div className="w-full bg-white h-16  rounded-t-xl">
                                <p className="text-xs fon-normal font-poppin mt-1 ml-3">Sales</p>
                                <h1 className="text-xl font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                            </div>
                            <div className="w-11/12 mt-1 ml-">
                                <p className="font-thin text-gray-600 font-poppins text-xs">From All Time</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
