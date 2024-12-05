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
                    <div className="flex gap-5 m-4 w-full justify-center items-center">
                        <div className="w-3/12 border-zinc-800 border-2 rounded-xl">
                            
                        </div>
                        <div className="w-3/12 border-zinc-800 border-2 rounded-xl">
                            
                        </div>
                        <div className="w-3/12 border-zinc-800 border-2 rounded-xl">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Customize;