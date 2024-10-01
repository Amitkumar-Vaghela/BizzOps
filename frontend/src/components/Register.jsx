import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBriefcase, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png'; // Ensure the logo path is correct
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [password, setPassword] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [errorPopup, setErrorPopup] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        const data = { name, email, businessName, password };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', data, {
                withCredentials: true,
            });

            if (response.status === 201) {
                console.log(response.data.message);
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            if (errorMessage === 'Request failed with status code 409') {
                const newError = 'User Already Exists'
                setErrorPopup(newError);
            } else {
                setErrorPopup(errorMessage)
            }

            setTimeout(() => {
                setErrorPopup("");
            }, 2000);
            console.error("Error during registration:", errorMessage);
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-200 to-indigo-400">
            <div className="w-3/5 m-20">
                <div>
                    <img src={logo} alt="Logo" />
                    <h1 className="text-2xl font-poppins font-normal mt-5">Join Us and Optimize Your Business!</h1>
                    <p className="text-lg text-gray-700 mt-9">
                        Sign up to streamline your operations and gain valuable insights for your business.
                    </p>
                    <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Ultimate Business Tool</h1>
                    <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Run and Scale Your CRM ERP Apps</h1>
                    <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />Easily Add And Manage Your Services</h1>
                    <h1 className="font-poppins font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-black pr-4" />It Bring Together Your Invoices, Clients And Leads</h1>
                </div>
            </div>
            <div className="w-2/4 m-16 mt-16">
                <form onSubmit={handleRegister} className="p-8">
                    <h2 className="text-4xl font-poppins font-bold mb-10">Sign Up</h2>
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faUser} className="absolute left-3 top-4 text-black" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-3/5 p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                        />
                    </div>
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-black" />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-3/5 p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                        />
                    </div>
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faBriefcase} className="absolute left-3 top-4 text-black" />
                        <input
                            type="text"
                            placeholder="Business Name"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-3/5 p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-4 text-black" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-3/5 p-3 pl-10 mb-4 bg-indigo-200 rounded-2xl shadow-md placeholder-gray-700"
                        />
                    </div>
                    <div className='relative mb-4' onClick={() => navigate('/login')}>
                        <p className='text-xs ml-2 font-font4 font-medium text-black'>
                            Already have an account? <span className="text-black font-bold underline cursor-pointer">Sign in</span>
                        </p>
                    </div>
                    <button type="submit" className="w-1/4 py-3 bg-white text-black font-poppins font-bold rounded-full hover:bg-gray-200 transition-all duration-500 hover:scale-110">
                        Register
                    </button>
                </form>
            </div>

            {showPopup && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-5 bg-green-300 font-medium font-poppins px-6 py-3 rounded-full">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                    <span className="text-green-700 font-poppins">Registration Successful!</span>
                </div>
            )}
            {errorPopup && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-5 bg-red-300 font-medium font-poppins px-6 py-3 rounded-full">
                    <FontAwesomeIcon icon={faLock} className="text-red-500 mr-2" />
                    <span className="text-red-700 font-poppins">{errorPopup}</span>
                </div>
            )}
        </div>
    );
}

export default Register;
