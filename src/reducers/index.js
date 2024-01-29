const initialState = {
    orders: [],
  };
  
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'PLACE_ORDER':
        return {
          ...state,
          orders: [...state.orders, { ...action.payload }],
        };
      case 'MOVE_ORDER':
        return {
          ...state,
          orders: state.orders.map((order) =>
            order.id === action.payload.orderId
              ? {
                  ...order,
                  stage: action.payload.stage,
                  
                }
              : order
          ),
        };
      case 'CANCEL_ORDER':
        return {
          ...state,
          orders: state.orders.filter((order) => order.id !== action.payload.orderId),
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;