import React,{useState,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveOrder, cancelOrder } from '../actions';
import './dashboard.css'



const PizzaDashboard = () => {

  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(true);
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState({});
  const [totalTimeSpent, setTotalTimeSpent] = useState({});
 
  const updateTimers = () => {
    setTime((prevTime) => {
      const updatedTime = { ...prevTime };
      const updatedTotalTimeSpent = { ...totalTimeSpent };
  
      for (const orderId in prevTime) {
        const { startCounter } = prevTime[orderId];
        const elapsedCounter = counter - startCounter;
  
        const secondCounter = elapsedCounter % 60;
        const minuteCounter = Math.floor(elapsedCounter / 60);
  
        const computedSecond =
          String(secondCounter).length === 1 ? `0${secondCounter}` : secondCounter;
        const computedMinute =
          String(minuteCounter % 60).length === 1 ? `0${minuteCounter % 60}` : minuteCounter % 60;
  
        updatedTime[orderId] = {
          ...prevTime[orderId],
          time: `${computedMinute}min${computedSecond}sec`,
        };
  
        const order = orders.find((order) => order.id === orderId);
  
        // Check if the order is in the "Order Picked" stage
        if (order && order.stage !== 'Order Picked') {
          // Calculate and update the total time spent for each stage
          const totalTimeInSeconds = elapsedCounter;
          updatedTotalTimeSpent[orderId] = updatedTotalTimeSpent[orderId]
            ? updatedTotalTimeSpent[orderId] + totalTimeInSeconds
            : totalTimeInSeconds;
        }
      }
  
      setTotalTimeSpent(updatedTotalTimeSpent);
      return updatedTime;
    });
  };
  
  
  
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  
  useEffect(() => {
    let intervalId;
    console.log('logging')
    if (isActive) {
      intervalId = setInterval(() => {
        setCounter((counter) => counter + 1);
        updateTimers();
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter, orders]);

  const handleMoveOrder = (orderId, stage) => {
     console.log('logged')
      // Start a new timer for the order
      setTime((prevTime) => ({
        ...prevTime,
        [orderId]: { startCounter: counter, time: '00min00sec' },
      }));
   
    setIsActive(true);
    dispatch(moveOrder(orderId, stage));
  };
  

  const handleCancelOrder = (orderId, stage) => {
    if (stage === 'Order Placed' || stage === 'Order in Making') {
      dispatch(cancelOrder(orderId));
      // Remove the timer for the canceled order
      const { [orderId]: _, ...updatedTime } = time;
      setTime(updatedTime);

      // Reset total time spent for the canceled order
      setTotalTimeSpent((prevTotalTimeSpent) => {
        const updatedTotalTime = { ...prevTotalTimeSpent };
        delete updatedTotalTime[orderId];
        return updatedTotalTime;
      });
    } else {
      console.log(`Cannot cancel order in ${stage} stage.`);
    }
  };;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}min${formattedSeconds}sec`;
  };
  
 

  return (
    <div>
      <h2>Pizza Stages section</h2>
      <div>

      <table className='stagesTable'>
          <thead>
            <tr>
              <th className='columnHeader'>Order Placed</th>
              <th className='columnHeader'>Order in Making</th>
              <th className='columnHeader'>Order Ready</th>
              <th className='columnHeader'>Order Picked</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='columnCell'>
                {orders
                  .filter((order) => order.stage === 'Order Placed')
                  .map((order) => {
                    const timeData = time[order.id] || { startCounter: counter, time: '00min00sec' };
                    const { time: timeTaken } = timeData;
                    const [minutes, seconds] = timeTaken.split('min');
                    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

                    const isSmallPizza = order.size === 'Small';
                    const isMediumPizza = order.size === 'Medium';
                    const isLargePizza = order.size === 'Large';

                    const timeLimit = isSmallPizza ? 3 * 60 : isMediumPizza ? 4 * 60 : isLargePizza ? 5 * 60 : 0;
                    const isOverTimeLimit = totalSeconds > timeLimit;
                    return (
                      <div
                        className={`cards ${isOverTimeLimit ? 'red-background' : ''}`}
                        key={order.id}
                      >
                        <p>
                          Order ID: {order.id} - {timeTaken}
                        </p>
                        <button onClick={() => handleMoveOrder(order.id, 'Order in Making')}>
                          Next
                        </button>
                      </div>
                    );
                  })}
              </td>
              <td className='columnCell'>
                {orders
                  .filter((order) => order.stage === 'Order in Making')
                  .map((order) => {
                    const timeData = time[order.id] || { startCounter: counter, time: '00min00sec' };
                    const { time: timeTaken } = timeData;
                    const [minutes, seconds] = timeTaken.split('min');
                    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

                    const isSmallPizza = order.size === 'Small';
                    const isMediumPizza = order.size === 'Medium';
                    const isLargePizza = order.size === 'Large';

                    const timeLimit = isSmallPizza ? 3 * 60 : isMediumPizza ? 4 * 60 : isLargePizza ? 5 * 60 : 0;
                    const isOverTimeLimit = totalSeconds > timeLimit;

                    return (
                      <div
                        className={`cards ${isOverTimeLimit ? 'red-background' : ''}`}
                        key={order.id}
                      >
                        <p>
                          Order ID: {order.id} -  {timeTaken}
                        </p>
                        <button onClick={() => handleMoveOrder(order.id, 'Order Ready')}>
                          Next
                        </button>
                      </div>
                    );
                  })}
              </td>
              <td className='columnCell'>
                {orders
                  .filter((order) => order.stage === 'Order Ready')
                  .map((order) => {
                    const timeData = time[order.id] || { startCounter: counter, time: '00min00sec' };
                    const { time: timeTaken } = timeData;
                    const [minutes, seconds] = timeTaken.split('min');
                    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);

                    const isSmallPizza = order.size === 'Small';
                    const isMediumPizza = order.size === 'Medium';
                    const isLargePizza = order.size === 'Large';

                    const timeLimit = isSmallPizza ? 3 * 60 : isMediumPizza ? 4 * 60 : isLargePizza ? 5 * 60 : 0;
                    const isOverTimeLimit = totalSeconds > timeLimit;

                    console.log('Order ID:', order.id);
                    console.log('Time Taken:', timeTaken);
                    console.log('Total Seconds:', totalSeconds);
                    console.log('Time Limit:', timeLimit);
                    console.log('Is Over Time Limit:', isOverTimeLimit);
                    return (
                      <div
                        className={`cards ${isOverTimeLimit ? 'red-background' : ''}`}
                        key={order.id}
                      >
                        <p>
                          Order ID: {order.id} -  {timeTaken}
                        </p>
                        <button onClick={() => handleMoveOrder(order.id, 'Order Picked')}>
                          Next
                        </button>
                      </div>
                    );
                  })}
              </td>
        <td className='columnCell'>
          {orders
            .filter((order) => order.stage === 'Order Picked')
            .map((order) => (
              <div className='cards' key={order.id}>
                <p>Order ID: {order.id}</p>
              </div>
            ))}
        </td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Display total pizzas delivered today */}
      <div>
        <h2>Main Section</h2>
        <table className='stagesTable'>
          <thead>
            <tr>
              <th className='columnHeader'>Order ID</th>
              <th className='columnHeader'>Stage</th>
              <th className='columnHeader'>Total Time Spent</th>
              <th className='columnHeader'>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const totalTimeSpentOrder = totalTimeSpent[order.id] || 0;
              return (
                <tr key={order.id}>
                  <td className='columnCell'>{order.id}</td>
                  <td className='columnCell'>{order.stage}</td>
                  <td className='columnCell'>{formatTime(totalTimeSpentOrder)}</td>
                  <td className='columnCell'>
                    {order.stage === 'Order Placed' || order.stage === 'Order in Making' ? (
                      <button onClick={() => handleCancelOrder(order.id, order.stage)}>Cancel</button>
                    ) : (
                      <span>Not cancellable</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <p>Total Pizzas Delivered Today: {orders.filter((order) => order.stage === 'Order Picked').length}</p>
      </div>
    </div>
  );
};

export default PizzaDashboard;
