import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AddInvoice = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState([{ itemName: '', qty: '', price: '', tax: '' }]);
    const [paid, setPaid] = useState(false);
    const [date, setDate] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false); 

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
        calculateTotals(updatedItems);
    };

    const addMoreItem = () => {
        setItems([...items, { itemName: '', qty: null, price: null, tax: null }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPopupVisible(true);
        const invoiceData = {
            name: customer,
            items,
            paid,
            date
        };

        try {
            const response = await axios.post('http://localhost:8000/api/v1/invoice/add-invoice', invoiceData, { withCredentials: true });
            if (response.status === 200) {   
                setCustomer('');
                setItems([{ itemName: '', qty: null, price: null, tax: null }]);
                setPaid(false);
                setDate('');
                setSubTotal(0);
                setGrandTotal(0);
                
            }
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        window.location.reload();
    };

    return (
        <div className="justify-center items-center flex m-4 rounded-2xl flex-col bg-[#28282B]">
            <h2 className='mb-2 font-font4 font-semibold text-white'>New Invoice</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                    className="w-1/4 text-center h-10 m-3 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                />
                <input
                    type='date'
                    value={date}
                    onChange={(e) => { setDate(e.target.value) }}
                    className="w-1/4 text-center h-10 m-3 rounded-2xl pr-4 bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                />
                {items.map((item, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                            required
                            className="w-1/5 text-center h-10 m-3 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                            required
                            min="1"
                            className="w-1/5 text-center h-10 m-3 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            required
                            min="1"
                            className="w-1/5 text-center h-10 m-3 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                        />
                        <input
                            type="number"
                            placeholder="Tax"
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                            required
                            min="0"
                            className="w-1/12 text-center h-10 m-3 pl-4 rounded-2xl bg-[#2b2b2e] shadow-xl font-font4 font-normal text-white"
                        />
                    </div>
                ))}
                <div className='w-2/4 flex'>
                    <div className="w-20 flex justify-start items-center text-center h-10 m-3 pl-4 rounded-xl bg-[#2b2b2e] shadow-xl font-font4 font-normal">
                        <input
                            type="checkbox"
                            className="w-3 h-3"
                            checked={paid}
                            onChange={(e) => setPaid(e.target.checked)}
                        />
                        <label className='pl-1 text-sm text-white font-font4 font-normal'>Paid</label>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={addMoreItem}
                            className="bg-white w-40 h-10 text-center text-sm m-3 font-font4 flex justify-center items-center rounded-xl hover:bg-blue-100 hover:text-black">
                            <FontAwesomeIcon icon={faPlus} className="text-xs pr-1" /> Add More Item
                        </button>
                    </div>
                </div>

                <div className='w-3/4 flex'>
                    <label htmlFor="" className='m-4 font-font4 text-white'>Sub Total</label>
                    <input type="text" readOnly value={subTotal} className="w-1/5 text-center h-10 m-3 rounded-2xl border-white border-[1px] bg-[#28282B] text-white font-font4 font-normal" />
                    <label htmlFor="" className='m-4 font-font4 text-white'>Grand Total</label>
                    <input type="text" readOnly value={grandTotal} className="w-1/5 text-center h-10 m-3 rounded-2xl border-white border-[1px] bg-[#28282B] text-white font-font4 font-normal" />
                </div>

                <button
                    type="submit"
                    className="bg-white w-1/6 h-10 text-center text-sm m-2 font-font4 flex justify-center items-center rounded-xl hover:bg-blue-100 hover:text-black">
                    <FontAwesomeIcon icon={faPlus} className="text-xs pr-1" /> Add Invoice
                </button>
            </form>
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-[#28282B] rounded p-6 max-w-sm w-full">
                        <h2 className="text-lg font-poppins text-white font-bold">Success!</h2>
                        <p className="mt-2 font-poppins text-white">Product added to sales successfully.</p>
                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={handleClosePopup} 
                                className="text-white font-bold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    );
};

export default AddInvoice;
