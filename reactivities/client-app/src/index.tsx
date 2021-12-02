import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.min.css";

import "./app/layout/styles.css";

import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";

import store, { StoreContext } from "./app/stores/store";

// history package comes with the react-router
import { createBrowserHistory } from "history";

// Creating history object to use outside & inside of react components
// note - now we can use this history object anywhere else in our application besides react components
export const history = createBrowserHistory();
// BrowserRouter provides 'history' object & it is also get use by useHistory hook

ReactDOM.render(
  <StoreContext.Provider value={store}>
    {/* Using lower level router instead BrowserRouter & passing history object for the components*/}
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
