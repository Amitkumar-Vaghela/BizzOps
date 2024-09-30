import React from "react";
import Sidebar from "./Sidebar";
import CustomBtn from "./CustomBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faChain, faChartArea, faChartGantt, faDollar, faMoneyBill1, faWallet } from "@fortawesome/free-solid-svg-icons";
import InventoryChart from "./InventoryChart";
import SalesChart from "./SalesChart";
import ProfitChart from "./ProfitChart";
import FinancialChart from "./FinancialCharts";
import FinancialDist from "./FinancialDist";

function Dashboard() {
    const totalSale = 123444;
    const sale = 123;

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-400">
                    <CustomBtn />
                    <h1 className="m-10  text-2xl font-medium font-font4">Dashboard</h1>

                    <div className="mt-2 m-9 flex justify-center items-center gap-4">
                        <div className="h-full w-1/5 ">
                            <div className="bg-white w-full h-24 shadow-lg rounded-2xl flex flex-col items-center">
                                <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                    <p className="text-base text-black font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faChartGantt} className="text-sm pr-1 text-blue-600" /> Total Sales</p>
                                    <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-normal mt-1 font-font4 text-xs">From All Time</p>
                                </div>
                            </div>

                        </div>
                        <div className="h-full w-1/5 ">
                            <div className="bg-white shadow-lg w-full h-24 rounded-2xl flex flex-col items-center">
                                <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faMoneyBill1} className="text-sm pr-1 text-teal-400" /> Total Profit</p>
                                    <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    <p className="font-normal mt-1 text-black font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-full w-1/5 ">

                            <div className="bg-white shadow-lg w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faDollar} className="text-red-400 text-sm pr-2" /> Total Cost</p>
                                    <h1 className="text-black text-2xl mb-1 font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    <p className="font-normal mt-1 font-font4 text-xs">From All Time</p>
                                </div>

                            </div>
                        </div>
                        <div className="h-full w-1/5 ">
                            <div className="bg-white shadow-lg w-full h-24 rounded-xl flex flex-col items-center">
                                <div className="w-full bg-white shadow-lg h-16  rounded-t-xl">
                                    <p className="text-base font-light font-font4 mt-1 ml-2"> <FontAwesomeIcon icon={faWallet} className="text-xs text-green-400 pr-1" /> Total Net Income</p>
                                    <h1 className="text-black text-2xl mb-1 font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                    <hr />
                                </div>
                                <div className="w-11/12 mt-1 ml-">
                                    {/* <hr /> */}
                                    <p className="font-normal mt-1 text-black font-font4 text-xs">From All Time</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gap-10 m-10 flex justify-center items-center">

                        <div className="w-2/4 mt-4 bg-blue-50 shadow-lg rounded-3xl">
                            <h1 className="text-center font-medium font-font4 mt-4">Last 30 Days Sales</h1>
                            <div className=" mr-3">
                                <SalesChart />
                            </div>
                        </div>

                        <div className="w-1/5">
                            <div className="h-full">
                                <div className="bg-blue-200 shadow-lg w-full h-24 rounded-2xl flex flex-col items-center">
                                    <div className="w-full bg-blue-50 shadow-lg h-16  rounded-t-xl">
                                        <p className="text-base text-black font-light font-font4 mt-1 ml-2">Sales</p>
                                        <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                        <hr />
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-medium mt-1 text-black font-font4 text-xs">Today's</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full mt-10">
                                <div className="bg-blue-200 w-full shadow-lg h-24 rounded-2xl flex flex-col items-center">
                                    <div className="w-full bg-blue-50 shadow-lg h-16  rounded-t-xl">
                                        <p className="text-base text-black font-light font-font4 mt-1 ml-2">Sales</p>
                                        <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                        <hr />
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-medium mt-1 text-black font-font4 text-xs">Last 30 Day's</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gap-10 m-10 flex justify-center items-center">

                        <div className="w-2/4 mt-4 bg-blue-50 shadow-lg rounded-3xl">
                            <h1 className="text-center font-medium font-font4 mt-4">Last 30 Days Profit</h1>
                            <div className=" mr-3">
                                <ProfitChart />
                            </div>
                        </div>

                        <div className="w-1/5 ">
                            <div className="h-full">
                                <div className="bg-blue-200  shadow-lg w-full h-24 rounded-2xl flex flex-col items-center">
                                    <div className="w-full bg-blue-50 shadow-lg h-16  rounded-t-xl">
                                        <p className="text-base font-light font-font4 mt-1 ml-2">Profit</p>
                                        <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                        <hr />
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-medium mt-1 text-black font-font4 text-xs">Today's</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full mt-10">
                            <div className="bg-blue-200  shadow-lg w-full h-24 rounded-2xl flex flex-col items-center">
                                    <div className="w-full bg-blue-50 shadow-lg h-16  rounded-t-xl">
                                        <p className="text-base font-light font-font4 mt-1 ml-2">Profit</p>
                                        <h1 className="text-black mb-1 text-2xl font-medium font-font4 ml-2">₹ {totalSale.toLocaleString()}<samp className="font-font4 text-base">.00</samp></h1>
                                        <hr />
                                    </div>
                                    <div className="w-11/12 mt-1 ml-">
                                        <p className="font-medium mt-1 text-black font-font4 text-xs">Today's</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="gap-10 m-10 flex justify-center items-center">

                        <div className="w-2/4 mt-4 shadow-lg bg-blue-50 rounded-3xl">
                            <h1 className="text-center font-medium font-font4 mt-4">Inventory</h1>
                            <div className=" mr-3">
                                <InventoryChart />
                            </div>
                        </div>

                        <div className="w-1/5">
                            <div className="w-full flex gap-4">
                                <div className="w-2/4 bg-blue-100 rounded-3xl text-center shadow-md">
                                    <p className="font-font4 font-light m-2 text-sm">Orders</p>
                                    <hr />
                                    <h1 className="font-font4 font-normal text-xl m-2">123</h1>
                                </div>
                                <div className="w-3/4 bg-blue-100 rounded-3xl text-center shadow-md">
                                    <p className="font-font4 font-light m-2 text-sm">Pending Orders</p>
                                    <hr />
                                    <h1 className="font-font4 font-normal text-xl m-2">1234</h1>
                                </div>
                            </div>
                            <div className="w-full flex gap-4 mt-4">
                                <div className="w-2/4 bg-blue-100 rounded-3xl text-center shadow-md">
                                    <p className="font-font4 font-light m-2 text-sm">Total Invoices</p>
                                    <hr />
                                    <h1 className="font-font4 font-normal text-xl m-2">123</h1>
                                </div>
                                <div className="w-2/4 bg-blue-100 rounded-3xl text-center shadow-md">
                                    <p className="font-font4 font-light m-2 text-sm">Pending Invoices</p>
                                    <hr />
                                    <h1 className="font-font4 font-normal text-xl m-2">1234</h1>
                                </div>
                            </div>
                            <div className="w-full flex justify-center gap-4 mt-4">
                                <div className="w-2/4 bg-blue-100 rounded-3xl text-center shadow-md">
                                    <p className="font-font4 font-light m-2 text-sm">Total Invoices</p>
                                    <hr />
                                    <h1 className="font-font4 font-normal text-xl m-2">123</h1>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="gap-10 m-10 flex justify-center items-center">

                        <div className="w-2/4 mt-4 bg-blue-50 shadow-lg rounded-3xl">
                            <h1 className="text-center font-medium text-sm mb-3 font-font4 mt-4">Sales v/s Profit v/s Cost v/s Expenses</h1>
                            <div className=" mr-3">
                            <FinancialChart />
                            </div>
                        </div>

                        <div className="w-1/4 mt-4 bg-blue-50 shadow-lg rounded-3xl">
                            <h1 className="text-center font-medium text-sm font-font4 mt-4">Financial Distribution</h1>
                            <div className=" mr-3">
                            <FinancialDist />
                            </div>
                        </div>

                    </div>



                    
                    

                </div>
            </div>

        </>
    );
}

export default Dashboard;
