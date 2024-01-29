import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';
import PizzaOrderForm from './Components/PizzaOrderForm';
import PizzaDashboard from './Components/PizzaDashboard';

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <div>
        <PizzaOrderForm />
        <PizzaDashboard />
      </div>
    </Provider>
  );
}

export default App;