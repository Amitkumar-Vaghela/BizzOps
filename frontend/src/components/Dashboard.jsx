import React from "react";
import Sidebar from "./Sidebar";
import CustomBtn from "./CustomBtn";

function Dashboard() {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="w-5/6 bg-gradient-to-r from-blue-200 to-indigo-200 m-1 rounded-2xl">
                    <CustomBtn />
                    <h1 className="m-10 text-3xl font-normal font-poppins">Dashboard</h1>
                    <div className="mt-2 flex justify-center items-center gap-4">
                        <div className="bg-white border-2 border-gray-300 w-1/4 h-24 rounded-2xl flex flex-col justify-center items-center">
                            <h1 className="text-base font-medium font-poppins text-center mb-1">Sale</h1>
                            <div className="bg-green-100 border-green-200 border-2 rounded-xl font-medium font-poppins text-center w-3/4 flex justify-center items-center">
                                <p className="text-lg">123</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 w-1/4 h-24 rounded-3xl shadow-md"></div>
                        <div className="bg-blue-50 w-1/4 h-24 rounded-3xl shadow-md"></div>
    
                    </div>

                    <div className="mt-4 flex justify-center items-center gap-5">
                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md flex flex-col justify-center items-center">
                            <h1 className="text-base font-medium font-poppins text-center mb-1">Sale</h1>
                            <div className="bg-green-100 border-green-200 border-2 rounded-xl font-medium font-poppins text-center w-3/4 flex justify-center items-center">
                                <p className="text-lg">123</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md"></div>
                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md"></div>
                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md"></div>
                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md"></div>
                        <div className="bg-blue-50 w-32 h-24 rounded-3xl shadow-md"></div>
    
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
