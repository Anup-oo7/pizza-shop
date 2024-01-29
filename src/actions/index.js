import { v4 as uuidv4 } from 'uuid';

export const placeOrder = (order) => ({
  type: 'PLACE_ORDER',
  payload: {
    id: uuidv4(),
    ...order,
    stage: 'Order Placed',
   
  },
});

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