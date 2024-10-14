import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function StaffTable({ staff, onUpdateStaff }) {
    const [amount, setAmount] = useState('');
    const [action, setAction] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [localStaff, setLocalStaff] = useState(staff);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    useEffect(() => {
        setLocalStaff(staff);
    }, [staff]);

    const deleteStaff = async (staffId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/staff/delete-staff', { staff: staffId }, { withCredentials: true });
            if (response.status === 200) {
                console.log("Staff deleted");
                setLocalStaff((prevStaff) => prevStaff.filter(item => item._id !== staffId));
                handleClosePopup();
            }
        } catch (error) {
            console.error("Error deleting staff:", error);
        }
    };

    const handleStaffClick = (staffId, actionType) => {
        setSelectedStaff(staffId);
        setAction(actionType);
        setPopupVisible(true);
    };

    const handleClosePopup = () => {
        setAmount(0);
        setSelectedStaff("");
        setAction("");
        setPopupVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdateStaff(action, selectedStaff, parseInt(amount));
        
        setLocalStaff((prevItems) => 
            prevItems.map(item => 
                item._id === selectedStaff
                    ? { 
                        ...item, 
                        debitCreditHistory: action === "add"
                            ? Number(item.debitCreditHistory) + Number(amount)
                            : Number(item.debitCreditHistory) - Number(amount) 
                      }
                    : item
            )
        );
        
        handleClosePopup();
    };

    const confirmDelete = (staffId) => {
        setDeleteItemId(staffId);
        setPopupVisible(true);
    };

    const handleDelete = () => {
        if (deleteItemId) {
            deleteStaff(deleteItemId);
        }
    };

    return (
        <>
            <Card className="w-full bg-[#28282B] shadow-md rounded-lg p-6">
                <Typography variant="p" color="blue-gray" className="mb-4 text-white font-poppins font-semibold">
                    Staff Records
                </Typography>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse ">
                        <thead>
                            <tr className="bg-zinc-900">
                                <th className="px-4 py-2 font-poppins text-white">Name</th>
                                <th className="px-4 py-2 font-poppins text-white">Email</th>
                                <th className="px-4 py-2 font-poppins text-white">Phone</th>
                                <th className="px-4 py-2 font-poppins text-white">Salary</th>
                                <th className="px-4 py-2 font-poppins text-white">To be Paid</th>
                                <th className="px-4 py-2 font-poppins text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localStaff.length > 0 ? (
                                localStaff.map((staffMember) => (
                                    <tr key={staffMember._id} className="text-center">
                                        <td className="px-4 py-2 text-sm font-medium text-white font-poppins">{staffMember.name}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-white font-poppins">{staffMember.email}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-white font-poppins">{staffMember.phone}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-white font-poppins">{staffMember.salary}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-white font-poppins">{staffMember.debitCreditHistory}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleStaffClick(staffMember._id, "add")}
                                                className="bg-green-400 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-green-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faPlus} /> Credit
                                            </button>
                                            <button
                                                onClick={() => handleStaffClick(staffMember._id, "remove")}
                                                className="bg-red-500 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-red-400 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faMinus} className=""/> Debit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(staffMember._id)}
                                                className="bg-blue-400 pt-2 text-black text-xs font-poppins font-medium px-2 py-1 rounded hover:bg-blue-300 mr-2"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No staff members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isPopupVisible && action && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#1d1d20] font-poppins p-6 w-1/4 rounded-2xl shadow-lg">
                        <h2 className="text-lg font-poppins text-white font-medium mb-4">
                            {action === "add" ? "+ Credit" : "- Debit"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                placeholder="Amount"
                                required
                                className="bg-[#222224] shadow-xl rounded p-2 mb-4 w-full"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="bg-blue-100 text-black px-4 py-2 rounded-2xl mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-400 text-white px-4 py-2 rounded-2xl"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPopupVisible && !action && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white font-poppins p-6 w-1/4 rounded-2xl shadow-lg">
                        <h2 className="text-lg font-poppins font-medium mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this staff member?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={handleClosePopup}
                                className="bg-blue-100 text-black px-4 py-2 rounded-2xl mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-2xl"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default StaffTable;