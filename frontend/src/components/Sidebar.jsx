import React from "react";
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartLine, 
    faClockFour, 
    faDollar, 
    faFileInvoice, 
    faMoneyBill, 
    faNoteSticky, 
    faReceipt, 
    faShop, 
    faUser, 
    faUsers 
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-1/6 min-h-screen sticky top-0 left-0 bg-[#28282B]">
            <img className="pt-10 ml-6 mb-10 w-40 h-20" src={logo} alt="logo" />
            
            <h1 
                onClick={() => navigate('/Dashboard')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-500 pr-2" /> 
                <span className={`${isActive('/Dashboard') ? 'text-blue-600' : 'text-white'}`}>
                    Dashboard
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Inventory')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faShop} className="text-green-600 pr-2" /> 
                <span className={`${isActive('/Inventory') ? 'text-blue-600' : 'text-white'}`}>
                    Inventory
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Sales')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faMoneyBill} className="text-yellow-500 pr-2" /> 
                <span className={`${isActive('/Sales') ? 'text-blue-600' : 'text-white'}`}>
                    Sales
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Invoices')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faFileInvoice} className="text-purple-500 pr-2" /> 
                <span className={`${isActive('/Invoices') ? 'text-blue-600' : 'text-white'}`}>
                    Invoices
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Report')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faReceipt} className="text-orange-500 pr-2" /> 
                <span className={`${isActive('/Report') ? 'text-blue-600' : 'text-white'}`}>
                    Report
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Expenses')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faDollar} className="text-red-500 pr-2" /> 
                <span className={`${isActive('/Expenses') ? 'text-blue-600' : 'text-white'}`}>
                    Expenses
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Payment')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faMoneyBill} className="text-teal-500 pr-2" /> 
                <span className={`${isActive('/Payment') ? 'text-blue-600' : 'text-white'}`}>
                    Payment
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Orders')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faClockFour} className="text-indigo-500 pr-2" /> 
                <span className={`${isActive('/Orders') ? 'text-blue-600' : 'text-white'}`}>
                    Orders
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Customer')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faUser} className="text-pink-500 pr-2" /> 
                <span className={`${isActive('/Customer') ? 'text-blue-600' : 'text-white'}`}>
                    Customer
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Staff')} 
                className="font-font4 font-medium text-md ml-7 mt-7 cursor-pointer">
                <FontAwesomeIcon icon={faUsers} className="text-gray-600 pr-2" /> 
                <span className={`${isActive('/Staff') ? 'text-blue-600' : 'text-white'}`}>
                    Staff
                </span>
            </h1>
            
            <h1 
                onClick={() => navigate('/Notes')} 
                className="font-font4 font-medium text-md ml-7 mt-7 mb-2 cursor-pointer">
                <FontAwesomeIcon icon={faNoteSticky} className="text-lime-500 pr-2" /> 
                <span className={`${isActive('/Notes') ? 'text-blue-600' : 'text-white'}`}>
                    Notes
                </span>
            </h1>
        </div>
    );
}

export default Sidebar;
