import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddStaff from "./AddStaff.jsx";
import StaffTable from "./StaffTable.jsx";
import Sidebar from "../Sidebar.jsx";
import CustomBtn from "../CustomBtn.jsx";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Account from "../Account.jsx";
const token = localStorage.getItem('accessToken');

function Staff() {
    const navigate = useNavigate();
    const [staffItems, setStaffItems] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const fetchStaff = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/staff/get-staff`, {headers:{'Authorization':token} ,withCredentials: true });
            if (response.data.statusCode === 200 && response.data.success) {
                setStaffItems(response.data.data.staff);
            } else {
                console.error('Failed to fetch staff: Unexpected response structure', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        }
    }, []);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff, updateTrigger]);

    const handleStaffAdded = (newStaff) => {
        setStaffItems(prevStaff => [...prevStaff, newStaff]);
    };

    const updateStaff = async (action, staffId, newAmount) => {
        try {
            const endpoint = action === "add"
                ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/staff/staff-credit`
                : `${import.meta.env.VITE_BACKEND_URL}/api/v1/staff/staff-debit`;

            const response = await axios.post(
                endpoint,
                { staff: staffId, amount: newAmount },
                { headers:{'Authorization':token},withCredentials: true }
            );

            if (response.data.statusCode === 200) {
                setUpdateTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error(`Error ${action}ing staff:`, error);
        }
    };

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] sm:w-5/6 bg-[#141415]">
                    <CustomBtn />
                    <Account />
                    <h1 className="sm:m-10 m-4 mt-20 text-2xl font-medium font-poppins flex items-center text-white ">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={() => navigate('/dashboard')} /> Staff
                    </h1>
                    <div className="justify-center items-center flex flex-col">
                        <div className="w-5/6 bg-[#28282B] rounded-xl gap-4 mb-4">
                            <h1 className="ml-4 mt-2 text-white font-semibold font-poppins">Add Staff</h1>
                            <AddStaff onStaffAdded={handleStaffAdded} />
                        </div>

                        <div className="mt-2 m-9 w-5/6 flex justify-center items-center gap-4">
                            <StaffTable staff={staffItems} onUpdateStaff={updateStaff} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Staff;