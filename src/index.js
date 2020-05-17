import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import activitiesReducer from "./reducers/activities-reducer";
import userReducer from "./reducers/user-reducer";

const allReducers = combineReducers({
  activities: activitiesReducer,
  user: userReducer
});

const store = createStore(
  allReducers,
  {
    activities: [],
    user: ""
  },
  window.devToolsExtension && window.devToolsExtension()
);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  rootElement
);

serviceWorker.unregister();
