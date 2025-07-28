import axios from "axios";
import { useState } from "react";

function AddExpense(){
    const [name, setName] = useState('')
    const [expAmount, setExpAmount] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)

    const handleAddExpense = async(e)=>{
        e.preventDefault()
        const data = {name,expAmount,description,date}
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expense/add-expense`,data,{withCredentials:true})
            if(response.data.statusCode === 200 ){
                console.log("expense added successfully");
                setPopupVisible(true);
            }
        } catch (error) {
            console.error("Error while adding expense", error.response?.data || error.message);
        }   
    }
    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    return(
        <>
            <form onSubmit={handleAddExpense} className="space-y-4 sm:mb-2 mb-4">
                <input
                    type="text"
                    placeholder="Item"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="sm:w-1/5 w-2/4 text-center bg-[#2b2b2e] shadow-xl h-10 m-2 rounded-2xl font-poppins font-normal text-white"
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    required
                    className="sm:w-1/11 w-2/6 text-center h-10 m-2 bg-[#2b2b2e] shadow-xl rounded-2xl  font-poppins font-normal text-white"
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="sm:w-1/5 w-4/5 text-center h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl  font-poppins font-normal text-white"
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="sm:w-1/11 w-3/6 text-center sm:pr-4 pr-2 h-10 m-2 rounded-2xl bg-[#2b2b2e] shadow-xl font-poppins font-normal text-white"
                />

                <button type="submit" className="bg-white hover:bg-blue-200 text-black px-4 py-2 rounded-xl">Add Expense</button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm sm:w-full w-4/5">
                        <h2 className="text-lg text-white font-bold">Success!</h2>
                        <p className="mt-2 text-white">Expense added successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleClosePopup} 
                                className="text-blue-500 font-semibold hover:text-blue-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default AddExpense