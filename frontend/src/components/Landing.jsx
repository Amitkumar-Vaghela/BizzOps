import React from "react";
import one from '../assets/one.png';
import two from '../assets/two.png';
import three from '../assets/three.png';
import four from '../assets/four.png';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate()
    return (
        <>
            <div className="w-full h-full flex justify-center items-center bg-gradient-to-r from-blue-200 to-indigo-400">
                <div className="absolute top-8 left-16 flex">
                    <img className="w-36 h-9" src={logo} alt="BizzOps Logo" />
                </div>

                <div className="absolute top-5 right-8 flex gap-4">
                    <button onClick={()=>{navigate('/login')}} className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-sm font-poppins px-4 py-2 rounded-full hover:text-black transition-all duration-500 hover:scale-110 ">Sign In</button>
                    <button onClick={()=>{navigate('/register')}} className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-sm font-poppins px-4 py-2 rounded-full hover:text-black transition-all duration-500 hover:scale-110">Sign Up</button>
                    <button className="border-indigo-500 border-b-2 border-r-2 bg-white text-black font-semibold text-sm font-poppins px-4 py-2 rounded-full hover:text-black transition-all duration-500 hover:scale-110">Pricing</button>
                </div>

                <div className="w-3/5 m-16 mt-28">
                    <h3 className="text-xl font-poppins font-normal mt-5">Manage Your Business, Smarter and Faster with</h3>
                    <h1 className="text-9xl font-poppins font-normal">BizzOps</h1>
                    <p className="text-md font-poppins font-normal mt-5">BizzOps is the ultimate business management platform, featuring a real-time dashboard, comprehensive reports, and insightful analysis tools. Streamline inventory, finance, and staff management to enhance efficiency and make informed decisions for your business success.</p>
                    <button className="mt-5 bg-gradient-to-r from-blue-300 to-indigo-300 text-gray-700-400 font-medium font-poppins px-6 py-3 rounded-full hover:bg-gradient-to-bl from-blue-300 to-indigo-300 transition">Request a Demo</button>
                    <h4 className="mt-5 text-lg font-poppins font-normal">Trusted by Businesses Worldwide</h4>
                    <p className="text-sm font-poppins text-gray-700 mt-2">Join thousands of businesses who have transformed their operations with BizzOps. Start streamlining your business today!</p>


                </div>

                <div className="w-2/4 m-16">
                    <img src={one} alt="Dashboard Illustration" />
                </div>
            </div>

            <div className="w-full h-full flex justify-center items-center bg-gradient-to-r from-blue-200 to-indigo-400">
                <div className="w-3/5 ml-14">
                    <h1 className="text-5xl font-poppins font-medium">Why Choose BizzOps?</h1>
                    <img className="" src={three} alt="Why Choose BizzOps" />
                </div>
                <div className="w-3/4 m-6">
                    <div className="w-full flex gap-4 mt-4">
                        <div className="w-2/4 h-36 bg-indigo-200 rounded-2xl shadow-indigo-500 shadow-md">
                            <h4 className="ml-2 text-2xl font-poppins font-normal mt-4 mb-2">Real-Time Dashboard</h4>
                            <p className="ml-2 text-md font-poppins font-light">Get a comprehensive view of your business operations at a glance, enabling quick decision-making.</p>
                        </div>
                        <div className="w-2/4 bg-indigo-200 rounded-2xl shadow-indigo-500 shadow-md">
                            <h4 className="ml-2 text-2xl font-poppins font-normal mt-4 mb-2">Detailed Invoices & Reports</h4>
                            <p className="ml-2 text-md font-poppins font-light">Invoices and generate insightful reports to analyze performance, identify trends, and support strategic decisions.</p>
                        </div>
                    </div>
                    <div className="w-full flex gap-4  mt-10">
                        <div className="w-2/4 h-36 bg-indigo-200 rounded-2xl shadow-indigo-500 shadow-md">
                            <h4 className="ml-2 text-2xl font-poppins font-normal mb-2 mt-4">Business Analysis Tools</h4>
                            <p className="ml-2 text-md font-poppins font-light">Utilize powerful analysis tools to assess your business health and uncover opportunities for growth.</p>
                        </div>
                        <div className="w-2/4 h-36 bg-indigo-200 rounded-2xl shadow-indigo-500 shadow-md">
                            <h4 className="ml-2 text-2xl font-poppins font-normal mt-4 mb-2">Streamlined Operations</h4>
                            <p className="ml-2 text-md font-poppins font-light">Simplify inventory, finance, and staff management for a more efficient and productive workplace.</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Landing;
