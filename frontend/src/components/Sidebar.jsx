import React from "react";
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faClockFour, faDollar, faFileInvoice, faMoneyBill, faNoteSticky, faReceipt, faShop, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

function Sidebar(){
    return(
        <>
            <div className="w-1/6 h-[calc(100vh)] sticky top-0 left-0 bg-white">
                <img className="pt-10 ml-6 mb-10 w-40 h-20" src={logo} alt="log" />
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faChartLine} className="text-blue-500 pr-2" /> Dashboard</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faShop} className="text-blue-500 pr-2" /> Inventory</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 pr-2" /> Sales</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faFileInvoice} className="text-blue-500 pr-2" /> Invoices</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faDollar} className="text-blue-500 pr-2" /> Expenses</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 pr-2" /> Payment</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faReceipt} className="text-blue-500 pr-2" /> Report</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faClockFour} className="text-blue-500 pr-2" /> Orders</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faUser} className="text-blue-500 pr-2" /> Customer</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7"> <FontAwesomeIcon icon={faUsers} className="text-blue-500 pr-2" /> Staff</h1>
                <h1 className="font-font4 font-medium text text-md ml-7 mt-7 mb-2"> <FontAwesomeIcon icon={faNoteSticky} className="text-blue-500 pr-2" /> Notes</h1>
            </div>
        </>
    )
}

export default Sidebar