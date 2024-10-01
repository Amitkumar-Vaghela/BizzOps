import React from "react";
import AddSales from './AddSales.jsx'
import SalesTable from './SalesTable.jsx'
import Sidebar from './Sidebar.jsx'
import CustomBtn from "./CustomBtn.jsx";

function Sales() {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-400">
                    <CustomBtn />
                    <h1 className="m-10  text-2xl font-medium font-font4">Dashboard  </h1>

                    <div className="mt-2 m-9 gap-4">
                    <AddSales />
                    <SalesTable />
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Sales