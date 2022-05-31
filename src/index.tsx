import ReactDOM, { render } from "react-dom";

import { App } from "./App";
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import rootReducer from "./modules/index";
import {
    createStateSyncMiddleware,
    initMessageListener,
  } from "redux-state-sync";

const store = createStore(rootReducer, composeWithDevTools());
console.log(store.getState())

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
 