import React from "react";
import Sidebar from "../Sidebar.jsx";
import Account from "../Account.jsx";

function Customize() {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] sm:w-5/6 bg-[#141415]">
                    <Account />
                    <div className="flex w-full justify-center items-center">
                        <div className="w-4/5 h-2/5 m-28">
                            <h1 className="m-6 text-7xl text-center text-white font-medium font-poppins">BizzOps Pricing</h1>
                            <p className="text-xl text-center text-white font-medium font-poppins">The business management platform made by shyam, for merchents </p>
                        </div>
                    </div>
                    <div className="sm:flex sm:gap-5 sm:w-full w-11/12 justify-center items-center">
                        <div className="sm:w-3/12 border-zinc-800 sm:m-0 mb-2 ml-6 border-2 rounded-xl">
                            <h1 className="text-2xl m-5 text-white font-medium font-poppins">Free</h1>
                            <h1 className="text-4xl m-5 text-white font-semibold font-poppins">₹0/year</h1>
                            <p className="text-sm m-5 text-white font-medium font-poppins">Free forever</p>
                            <p className="text-base m-5 text-white font-light font-poppins">For learning and exploring BizzOps as a SAAS platform</p>
                            <p className="text-xl m-5 text-white font-medium font-poppins">Access to only Inventory, Sales Expenses and Reports</p>
                            <p className="text-xl text-black font-medium font-poppins">.</p>
                            <button className="bg-white text-black text-lg text-center font-poppins font-medium rounded-md w-2/6 h-10 m-5 hover:bg-zinc-300">Try for free</button> 
                        </div>
                        <div className="sm:w-3/12 border-zinc-800 sm:m-0 mb-2 ml-6 border-2 rounded-xl">
                            <h1 className="text-2xl m-5 text-white font-medium font-poppins">Dedicated</h1>
                            <h1 className="text-4xl m-5 text-white font-semibold font-poppins">₹3999/Month</h1>
                            <p className="text-sm m-5 text-white font-medium font-poppins">Pay as subscription</p>
                            <p className="text-base m-5 text-white font-light font-poppins">For production operations and with zero paper management on BizzOps.</p>
                            <p className="text-xl m-5 text-white font-medium font-poppins">Access to only Inventory, Sales, Invoices, Expenses, Reports, Notes and payments</p> 
                            <button className="bg-white text-black text-lg text-center font-poppins font-medium rounded-md w-2/6 h-10 m-5 hover:bg-zinc-300">Get Started</button>
                        </div>
                        <div className="sm:w-3/12 border-zinc-800 sm:m-0 ml-6 border-2 rounded-xl">
                            <h1 className="text-2xl m-5 text-white font-medium font-poppins">Premium</h1>
                            <h1 className="text-4xl m-5 text-white font-semibold font-poppins">₹6999/year</h1>
                            <p className="text-sm m-5 text-white font-medium font-poppins">Pay as subscription</p>
                            <p className="text-base m-5 text-white font-light font-poppins">For many insigths with the visualized dashboard and report</p>
                            <p className="text-xl m-5 text-white font-medium font-poppins">Access to Dashboard, Inventory, Sales, Reports, and many more....</p>
                            <button className="bg-white text-black text-lg text-center font-poppins font-medium rounded-md w-2/6 h-10 m-5 hover:bg-zinc-300">Get Started</button>
                             
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default Customize;