import React from "react";
import Sidebar from "./Sidebar";
import CustomBtn from "./CustomBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import InventoryChart from "./InventoryChart";
import SalesChart from "./SalesChart";
import ProfitChart from "./ProfitChart";

function Dashboard() {
    const totalSale = 123444;
    const sale = 123;

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="w-5/6 bg-[#f2f2f4] mt-3 mr-3 mb-3 rounded-2xl">
                    <CustomBtn />
                    <h1 className="m-10  text-2xl font-medium font-poppins">Dashboard</h1>
                    <div className="mt-2 flex justify-center items-center gap-4">
                        <div className="h-full w-1/4 ">
                            <div className="bg-slate-400 w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base text-black font-light font-poppin mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-thin mt-1 text-black font-poppins text-xs">From All Time</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 items-center m-1">
                                <div className="bg-slate-700 w-1/2 h-24 rounded-xl flex mt-2 flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                                <div className="bg-slate-700 w-1/2 h-24 rounded-xl mt-2 flex flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-full w-1/4 ">
                            <div className="bg-slate-400 w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base text-base font-light font-poppin mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-thin mt-1 text-black font-poppins text-xs">From All Time</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 items-center m-1">
                                <div className="bg-slate-700 w-1/2 h-24 mt-2 rounded-xl flex flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                                <div className="bg-slate-700 w-1/2 h-24 rounded-xl mt-2 flex flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-full w-1/4 ">
                            <div className="bg-slate-400 w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base text-base font-light font-poppin mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black text-2xl font-medium font-poppin ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-thin mt-1 text-black font-poppins text-xs">From All Time</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2 items-center m-1">
                                <div className="bg-slate-700 w-1/2 h-24 mt-2 rounded-xl flex flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                                <div className="bg-slate-700 w-1/2 h-24 mt-2 rounded-xl flex flex-col items-center">
                                    <div className="w-full bg-black h-16  rounded-t-xl">
                                        <p className="text-xs text-white font-normal font-poppin mt-1 ml-3">Sales</p>
                                        <h1 className="text-xl text-white font-medium font-poppin mt-2 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-poppins text-base">.00</samp></h1>
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-thin text-white font-poppins text-xs">Today's Sale</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/4">
                    <InventoryChart/>
                    </div>
                    <div className="w-2/4 h-1/6 bg-slate-800 rounded-3xl" >
                    <div className="m-5 mb-5"><SalesChart/></div></div>
                    {/* <InventoryChart/> */}
                    {/* <SalesChart /> */}
                    <ProfitChart /> 
                </div>
            </div>
            
        </>
    );
}

export default Dashboard;
