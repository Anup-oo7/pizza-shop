

// Global variable to keep track of the order ID counter
let orderIdCounter = 1;

const generateOrderId = () => {
  const paddedOrderId = orderIdCounter.toString().padStart(3, '0');
  return `${paddedOrderId}`;
};

export const placeOrder = (order) => {
  const orderId = generateOrderId();

  return {
    type: 'PLACE_ORDER',
    payload: {
      id: orderId,
      ...order,
      stage: 'Order Placed',
    },
  };
};

export const moveOrder = (orderId, stage) => ({
  type: 'MOVE_ORDER',
  payload: {
    orderId,
    stage,
  },
});

export const cancelOrder = (orderId) => ({
  type: 'CANCEL_ORDER',
  payload: {
    orderId,
  },
});
