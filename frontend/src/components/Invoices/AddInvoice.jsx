import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import CustomBtn from '../CustomBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AddInvoice = () => {
    const navigate = useNavigate()
    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ itemName: '', qty: null, price: null, tax: null }]);
    const [paid, setPaid] = useState(false);
    const [date, setDate] = useState('');
    const [subTotal, setSubTotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)


    const calculateTotals = (updatedItems) => {
        const newSubTotal = updatedItems.reduce((acc, item) => acc + (item.qty * item.price || 0), 0);
        const newGrandTotal = updatedItems.reduce((acc, item) => {
            const itemTotal = (item.qty * item.price || 0);
            const taxAmount = itemTotal * (item.tax / 100 || 0);
            return acc + itemTotal + taxAmount;
        }, 0);
        setSubTotal(newSubTotal);
        setGrandTotal(newGrandTotal);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItems(updatedItems);
        calculateTotals(updatedItems)
    };

    const addMoreItem = () => {
        setItems([...items, { itemName: '', qty: null, price: null, tax: null }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const invoiceData = {
            name: customer,
            items,
            paid,
            date
        };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/invoice/add-invoice', invoiceData, { withCredentials: true });
            if (response.statusCode === 200) {
                console.log('success');
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div id="infoCards" className="overflow-y-auto h-[calc(100vh)] w-5/6 bg-gradient-to-r from-blue-100 to-indigo-300">
                    <CustomBtn />
                    <h1 className="m-10 text-2xl font-medium font-font4 flex items-center"> <FontAwesomeIcon icon={faArrowLeft} className="text-md pr-2" onClick={() => navigate('/dashboard')} /> Add Invoices</h1>
                    <div className="justify-center items-center flex m-10 rounded-2xl flex-col bg-white">
                        <h2 className='m-10 font-font4 font-semibold'>New invoice</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Customer ID"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                required
                                className="w-1/4 text-center h-10 m-3 rounded-2xl bg-gray-200 shadow-2xl font-font4 font-light"
                            />
                            <input
                                type='date'
                                value={date}
                                onChange={(e) => { setDate(e.target.value) }}
                                className="w-1/4 text-center h-10 m-3 rounded-2xl pr-4 bg-gray-200 shadow-2xl font-font4 font-light"
                            />

                            {items.map((item, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        value={item.itemName}
                                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                        required
                                        className="w-1/5 text-center h-10 m-3 rounded-2xl bg-gray-200 shadow-2xl font-font4 font-light"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                        required
                                        min="1"
                                        className="w-1/5 text-center h-10 m-3 rounded-2xl bg-gray-200 shadow-2xl font-font4 font-light"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        required
                                        min="1"
                                        className="w-1/5 text-center h-10 m-3 rounded-2xl bg-gray-200 shadow-2xl font-font4 font-light"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Tax"
                                        value={item.tax}
                                        onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                                        required
                                        min="0"
                                        className="w-1/12 text-center h-10 m-3 pl-4 rounded-2xl bg-gray-200 shadow-2xl font-font4 font-light"
                                    />

                                </div>

                            ))}

                            <div className='w-2/4 flex'>
                                <div className="w-20 flex justify-start items-center text-center h-10 m-3 pl-4 rounded-xl bg-gray-200 shadow-2xl font-font4 font-light">
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        checked={paid}
                                        onChange={(e) => setPaid(e.target.checked)}

                                    />
                                    <label className='pl-1 text-sm font-font4 font-normal'>Paid</label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        onClick={addMoreItem}
                                        className="bg-blue-200 w-40 h-10 text-center text-sm m-3 font-font4 flex justify-center items-center rounded-xl hover:bg-blue-100 hover:text-black">
                                        <FontAwesomeIcon icon={faPlus} className="text-xs pr-1" /> Add More Item
                                    </button>
                                </div>
                            </div>

                            <div className='w-3/4 flex'>
                                <form >
                                    <label htmlFor="" className='m-4 font-font4'>Sub Total </label>
                                    <input type="text" readOnly value={subTotal} className="w-1/5 text-center h-10 m-3 rounded-2xl border-gray-400 border-[1px] bg-gray-100 font-font4 font-normal" />
                                    <label htmlFor="" className='m-4 font-font4'>Grand Total </label>
                                    <input type="text" readOnly value={grandTotal} className="w-1/5 text-center h-10 m-3 rounded-2xl border-gray-400 border-[1px] bg-gray-100 font-font4 font-normal" />
                                </form>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-300 w-1/6 h-10 mb-10 text-center text-sm m-2 font-font4 flex justify-center items-center rounded-xl hover:bg-blue-100 hover:text-black">
                                <FontAwesomeIcon icon={faPlus} className="text-xs pr-1" /> Add Invoice
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddInvoice;
