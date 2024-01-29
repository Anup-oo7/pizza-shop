import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../actions';
import './orderform.css'
// ... (other imports)

const PizzaOrderForm = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const maxOrders = 10;

  const [order, setOrder] = useState({ type: '', size: '', base: '' });
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (!order.type || !order.size || !order.base) {
      setAlertMessage('Please select an option for each field.');
      return;
    }

    if (orders.length >= maxOrders) {
      setAlertMessage("Cannot accept more orders at the moment. Try again later.");
      return;
    }

    dispatch(placeOrder(order));
    setOrder({ type: '', size: '', base: '' });
    setAlertMessage('');
  };

  return (
    <div>
      <h2>Place Pizza Order</h2>
    <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-evenly',alignItems:'center'}}>
      <label className='dropdown'>
        Type:
        <select className='dropdown' name="type" value={order.type} onChange={handleInputChange}>
          <option value="" disabled>Select Type</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
        </select>
      </label>
      <label>
        Size:
        <select className='dropdown' name="size" value={order.size} onChange={handleInputChange}>
          <option value="" disabled>Select Size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          {/* Add more options as needed */}
        </select>
      </label>
      <label>
        Base:
        <select className='dropdown' name="base" value={order.base} onChange={handleInputChange}>
          <option value="" disabled>Select Base</option>
          <option value="Thin">Thin</option>
          <option value="Thick">Thick</option>
        </select>
      </label>
      <button className='dropdown' onClick={handlePlaceOrder} disabled={!order.type || !order.size || !order.base}>
        Place Order
      </button>
     
      {orders.length >= maxOrders && <p>Not taking any order for now. Maximum orders reached.</p>}
    </div>
    </div>
  );
};

export default PizzaOrderForm;


