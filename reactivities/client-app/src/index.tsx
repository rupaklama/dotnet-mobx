import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";

import "./app/layout/styles.css";

import App from "./app/layout/App";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import store, { StoreContext } from "./app/stores/store";

// to use history object in non-component files across our app
import { createBrowserHistory } from "history";

// Creating history object to use outside & inside of react components
// note - now we can use this history object anywhere else in our application besides react components
export const history = createBrowserHistory();
// BrowserRouter provides 'history' object & it is also get use by useHistory hook,
// this is just a note

ReactDOM.render(
  <StoreContext.Provider value={store}>
    {/* Using lower level router instead BrowserRouter & passing history object for the components,
      to use history object in non-component files across our app
    */}
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
