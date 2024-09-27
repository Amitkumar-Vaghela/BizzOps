import React from "react";
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faClockFour, faDollar, faFileInvoice, faMoneyBill, faNoteSticky, faReceipt, faShop, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

function Sidebar(){
    return(
        <>
            <div className="w-1/6 min-h-screen m-1 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                <img className="pt-10 ml-6 mb-9 w-40 h-20" src={logo} alt="log" />
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faChartLine} className="text-black pr-2" /> Dashboard</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faShop} className="text-black pr-2" /> Inventory</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faMoneyBill} className="text-black pr-2" /> Sales</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faFileInvoice} className="text-black pr-2" /> Invoices</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faDollar} className="text-black pr-2" /> Expenses</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faMoneyBill} className="text-black pr-2" /> Payment</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faReceipt} className="text-black pr-2" /> Report</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faClockFour} className="text-black pr-2" /> Orders</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faUser} className="text-black pr-2" /> Customer</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faUsers} className="text-black pr-2" /> Staff</h1>
                <h1 className="font-poppins font-light text-md ml-7 mt-5"> <FontAwesomeIcon icon={faNoteSticky} className="text-black pr-2" /> Notes</h1>
            </div>
        </>
    )
}

export default Sidebar