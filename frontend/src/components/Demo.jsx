import React, { useState } from "react";
import axios from "axios";
import logo from '../assets/logo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faLock, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Demo() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const access_key = import.meta.env.VITE_FORM_API_KEY;

    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", `${access_key}`);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };

    return (
        <>
            <div className="w-full h-screen sm:flex sm:justify-center sm:items-center bg-[#141415]">
                <div className="sm:w-1/4 sm:m-28 sm:mt-20 ">
                    <img src={logo} alt="" className="w-24 h-6 sm:w-auto sm:h-auto xl:w-36 xl:h-9 absolute top-6 left-8" onClick={() => { navigate('/') }} />
                    <form onSubmit={onSubmit} className="p-8 mt-20">
                        <h2 className="text-4xl text-white font-poppins font-bold mb-10">Contact Us</h2>
                        <div className="relative mb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-zinc-300" />
                            <input
                                type="text"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl text-white font-medium rounded-2xl placeholder-zinc-300"
                            />
                        </div>
                        <div className="relative mb-4">
                            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-4 text-zinc-300" />
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl rounded-2xl font-medium text-white placeholder-zinc-300"
                            />
                        </div>
                        <div className="relative mb-4">
                            <FontAwesomeIcon icon={faMessage} className="absolute left-3 top-4 text-zinc-300" />
                            <input
                                type="text"
                                placeholder="Message"
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-full p-3 pl-10 mb-4 bg-[#2b2b2e] shadow-xl rounded-2xl font-medium text-white placeholder-zinc-300"
                            />
                        </div>
                        <button type="submit" className="w-2/5 py-3 bg-white text-black font-poppins font-bold rounded-full hover:bg-gray-200 transition-all duration-500 hover:scale-110">
                            Submit
                        </button>
                    </form>
                </div>
                <div className="sm:w-3/5 sm:m-20 w-11/12 m-10">
                    <div>
                        {/* <img src={logo} alt="" srcset="" className="hidden sm:block sm:w-auto sm:h-auto w-26 h-10" /> */}
                        <h1 className="text-3xl text-white font-poppins font-normal mt-5">Manage Your Business, Smarter and Faster.</h1>
                        <p className="text-xl text-zinc-400 mt-9">
                            Streamline your operations and gain insights to make informed decisions.Join us and take the first step towards optimizing your business today!
                        </p>
                        <h1 className="font-poppins text-zinc-400 font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-zinc-400 pr-4" />Ultimate Business Tool</h1>
                        <h1 className="font-poppins text-zinc-400 font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-zinc-400 pr-4" />Run and Scale Your CRM ERP Apps</h1>
                        <h1 className="font-poppins text-zinc-400 font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-zinc-400 pr-4" />Easily Add And Manage Your Services</h1>
                        <h1 className="font-poppins text-zinc-400 font-light mt-4"><FontAwesomeIcon icon={faCheck} className="text-zinc-400 pr-4" />It Bring Together Your Invoices,Clients And Leads</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Demo;
