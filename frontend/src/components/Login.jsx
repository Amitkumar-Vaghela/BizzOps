import React, { useState } from "react";
import axios from "axios";
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorPopup, setErrorPopup] = useState("")

    async function handleLogin(e) {
        e.preventDefault();
        const data = { email, password };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', data, {
                withCredentials: true
            });

            if (response.status === 200) {
                const { accessToken } = response.data;

                if (accessToken) {
                    localStorage.setItem("accessToken", "Bearer " + accessToken);
                }
                navigate('/dashboard')
            }
            console.log(response.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if(errorMessage === 'Request failed with status code 401'){
                const newError = 'Invalid Email Or Password'
                setErrorPopup(newError)
            }else{
                setErrorPopup(errorMessage);
            }

            setTimeout(() => {
                setErrorPopup("");
            }, 2000);
            console.error("Error during login:", error.response?.data || error.message);
        }
    }

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-indigo-400">
                <div className="w-3/5 m-20">
                    <div>
                        <img src={logo} alt="" srcset="" />
                        <h1 className="text-2xl font-poppins font-normal mt-5">Manage Your Business, Smarter and Faster.</h1>
                        <p className="text-lg text-gray-700 mt-9">
                            Streamline your operations and gain insights to make informed decisions.Join us and take the first step towards optimizing your business today!
                        </p>
                        <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Ultimate Business Tool</h1>
                        <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Run and Scale Your CRM ERP Apps</h1>
                        <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Easily Add And Manage Your Services</h1>
                        <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />It Bring Together Your Invoices,Clients And Leads</h1>
                    </div>
                </div>
                <div className="w-2/4 m-16 mt-28">
                    <form onSubmit={handleLogin} className="p-8">
                        <h2 className="text-4xl font-poppins font-bold mb-10">Sign In</h2>
                        <div className="relative mb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-black" />
                            <input
                                type="text"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-3/5 p-3 pl-10 mb-4 bg-indigo-300 rounded-2xl shadow-md placeholder-gray-700"
                            />
                        </div>
                        <div className="relative mb-4">
                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-4 text-black" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-3/5 p-3 pl-10 mb-4 bg-indigo-300 rounded-2xl shadow-md placeholder-gray-700"
                            />
                        </div>
                        <button type="submit" className="w-1/4 py-3 bg-white text-black font-poppins font-bold rounded-full hover:bg-gray-200 transition-all duration-500 hover:scale-110">
                            Login
                        </button>
                    </form>
                </div>
                {errorPopup && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-5 bg-red-300 font-medium font-poppins px-6 py-3 rounded-full">
                    <FontAwesomeIcon icon={faLock} className="text-red-500 mr-2" />
                    <span className="text-red-700 font-poppins">{errorPopup}</span>
                </div>
            )}
            </div>
        </>
    );
}

export default Login;
