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
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-[#f1f1f3]">
                    <CustomBtn />
                    <h1 className="m-10  text-2xl font-medium font-font4">Dashboard</h1>
                    
                    <div className="mt-2 m-9 flex justify-center items-center gap-4">
                        <div className="h-full w-1/5 ">
                            <div className="bg-white w-full h-24 rounded-2xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base text-black font-normal font-font4 mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-normal mt-1 text-blue-400 font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                            
                        </div>
                        <div className="h-full w-1/5 ">
                            <div className="bg-white w-full h-24 rounded-2xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-normal mt-1 text-black font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-full w-1/5 ">
                            <div className="bg-white w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black text-2xl mb-1 font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    <p className="font-normal mt-1 text-black font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-full w-1/5 ">
                            <div className="bg-white w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2">Total Sales</p>
                                    <h1 className="text-black text-2xl mb-1 font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr/>
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-normal mt-1 text-black font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gap-20 m-10 flex justify-center items-center">
                        <div className="w-2/4 mt-4 bg-white rounded-3xl">
                            <h1 className="text-center font-medium font-font4 mt-4">Past 30 Days Sales</h1>
                            <div className=" mr-3">
                                <SalesChart />
                            </div>
                        </div>
                        <div className="w-1/5 bg-black">asw</div>
                    </div>




                    {/* <div className="w-1/4 ">
                        <InventoryChart />
                    </div> */}
                    {/* <div className="w-2/4 h-1/6 bg-slate-800 rounded-3xl" >
                        <div className="m-5 mb-5"><SalesChart /></div></div> */}
                    {/* <InventoryChart/> */}
                    {/* <SalesChart /> */}
                    {/* <ProfitChart /> */}
                </div>
            </div>

        </>
    );
}

export default Dashboard;
