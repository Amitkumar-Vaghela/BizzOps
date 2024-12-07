import React from "react";
import one from '../assets/one.png';
import two from '../assets/two.png';
import three from '../assets/three.png';
import four from '../assets/four.png';
import logo from '../assets/logo2.png';
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate()
    return (
        <>
            <div className="sm:w-full sm:h-full flex justify-center items-center bg-[#141415]">
                <div className="absolute sm:top-8 top-6 left-4 md:left-16 flex">
                    <img className="w-24 h-6 sm:w-36 sm:h-9" src={logo} alt="BizzOps Logo" />
                </div>

                <div className="absolute top-5 right-4  md:right-8 flex gap-2 sm:gap-4">
                    <button onClick={() => { navigate('/login') }} className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-full hover:scale-110 transition-all duration-500">Sign In</button>
                    <button onClick={() => { navigate('/register') }} className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-full hover:scale-110 transition-all duration-500">Sign Up</button>
                    <button onClick={()=>{navigate("/Customizes")}} className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-full hover:scale-110 transition-all duration-500">Pricing</button>
                </div>

                <div className="sm:w-3/5 sm:m-16 m-10 mt-20 sm:mt-28 w-full">
                    <h3 className="sm:text-xl text-lg sm:w-auto w-full text-white font-font4 font-normal mt-5">Manage Your Business, Smarter and Faster with</h3>
                    <h1 className="sm:text-9xl text-7xl text-white font-poppins font-bold">BizzOps</h1>
                    <p className="text-md font-poppins sm:text-white text-zinc-400 font-normal mt-5">BizzOps is the ultimate business management platform, featuring a real-time dashboard, comprehensive reports, and insightful analysis tools. Streamline inventory, finance, and staff management to enhance efficiency and make informed decisions for your business success.</p>
                    <button onClick={()=>{navigate('/Demo')}} className="mt-5 bg-gradient-to-r from-blue-300 to-indigo-300 text-gray-700-400 font-medium font-poppins px-6 py-3 rounded-full hover:bg-gradient-to-bl transition">Request a Demo</button>
                    <h4 className="mt-5 text-lg font-poppins text-white font-normal">Trusted by Businesses Worldwide</h4>
                    <p className="text-sm font-poppins text-zinc-400 mt-2">Join thousands of businesses who have transformed their operations with BizzOps. Start streamlining your business today!</p>
                </div>
                <div className="hidden sm:block sm:w-2/4 sm:m-16">
                    <img src={one} alt="Dashboard Illustration" />
                </div>
            </div>


            <div className="sm:w-full sm:h-full sm:flex sm:justify-center sm:items-center bg-[#141415]">
                <div className="sm:w-3/5 sm:ml-14 w-full m-10">
                    <h1 className="sm:text-5xl text-2xl font-poppins font-medium text-white">Why Choose BizzOps?</h1>
                    <img className="sm:block hidden" src={three} alt="Why Choose BizzOps" />
                </div>
                <div className="sm:w-3/4 sm:m-6 w-full">
                    <div className="sm:w-full sm:flex sm:gap-4 sm:mt-4 m-10 w-full">
                        <div className="sm:w-2/4 w-4/5 sm:h-36 bg-[#28282B] rounded-2xl transition-all duration-500 hover:scale-105">
                            <h4 className="ml-2 text-2xl text-white font-poppins font-normal sm:mt-4 sm:mb-2 sm:py-0 py-4">Real-Time Dashboard</h4>
                            <p className="ml-2 text-md font-poppins text-zinc-300 font-light sm:py-0 py-1">Get a comprehensive view of your business operations at a glance, enabling quick decision-making.</p>
                        </div>
                        <div className="sm:w-2/4 w-4/5 sm:h-36 bg-[#28282B] rounded-2xl transition-all duration-500 hover:scale-105">
                            <h4 className="ml-2 text-2xl text-white font-poppins font-normal mt-4 mb-2 sm:py-0 py-4">Detailed Invoices & Reports</h4>
                            <p className="ml-2 text-md font-poppins text-white font-light sm:py-0 py-2">Invoices and generate insightful reports to analyze performance, identify trends, and support strategic decisions.</p>
                        </div>
                    </div>
                    <div className="sm:w-full sm:flex sm:gap-4 sm:mt-4 m-10 w-full">
                        <div className="sm:w-2/4 w-4/5 sm:h-36 bg-[#28282B] rounded-2xl transition-all duration-500 hover:scale-105">
                            <h4 className="ml-2 text-2xl font-poppins font-normal text-white mb-2 mt-4 sm:py-0 py-4">Business Analysis Tools</h4>
                            <p className="ml-2 text-md font-poppins text-white font-light sm:py-0 py-2">Utilize powerful analysis tools to assess your business health and uncover opportunities for growth.</p>
                        </div>
                        <div className="sm:w-2/4 w-4/5 sm:h-36 bg-[#28282B] rounded-2xl transition-all duration-500 hover:scale-105">
                            <h4 className="ml-2 text-2xl font-poppins font-normal text-white mt-4 mb-2 sm:py-0 py-4">Streamlined Operations</h4>
                            <p className="ml-2 text-white text-md font-poppins font-light sm:py-0 py-2">Simplify inventory, finance, and staff management for a more efficient and productive workplace.</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Landing;
