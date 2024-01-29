import React, { useState, useEffect } from 'react';

const OrderForm = ({ addOrder }) => {
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [base, setBase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder({ type, size, base });
    setType('');
    setSize('');
    setBase('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
      </label>
      <label>
        Size:
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="Large">Large</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
        </select>
      </label>
      <label>
        Base:
        <select value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="Thin">Thin</option>
          <option value="Thick">Thick</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

const OrderCard = ({ order, timeSpent }) => {
  const [stage, setStage] = useState('Order Placed');

  useEffect(() => {
    const timer = setInterval(() => {
      if (stage === 'Order Picked') {
        clearInterval(timer);
      } else {
        setStage((prevStage) => {
          switch (prevStage) {
            case 'Order Placed':
              return 'Order in Making';
            case 'Order in Making':
              return 'Order Ready';
            case 'Order Ready':
              return 'Order Picked';
            default:
              return prevStage;
          }
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={timeSpent > 180 ? 'highlighted' : ''}>
      <h3>{order.type}</h3>
      <p>Size: {order.size}</p>
      <p>Base: {order.base}</p>
      <p>Stage: {stage}</p>
      <p>Time Spent: {timeSpent} seconds</p>
    </div>
  );
};

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-list">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} timeSpent={order.timeSpent} />
      ))}
    </div>
  );
};

const App = () => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    if (orders.length < 10) {
      const newOrder = { ...order, id: Date.now(), timeSpent: 0 };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } else {
      alert('Not taking any order for now');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          timeSpent: order.timeSpent + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <h1>Restaurant Orders</h1>
      <OrderForm addOrder={addOrder} />
      <OrdersList orders={orders} />
    </div>
  );
};

export default App;
