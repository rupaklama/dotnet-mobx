import { history } from "./../../index";
import axios, { AxiosError, AxiosResponse } from "axios";

import { toast } from "react-toastify";
import store from "../stores/store";

import { Activity } from "./../models/activity";
import { User, UserFormValues } from "../models/user";

/* to delay the response */
const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

// note - we want to get this from some kind of variable from .env file
// & also we want to check if we are running in dev mode or prod mode as we
// don't want to use this full path for published react application to avoid issues.
// The important thing is that our app will be hosted as a static content from the Server
// & if we use this full url path - "http://localhost:5001/api" when we are on production,
// it's going to give us problems.
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

/* sending token in request object to persist auth */
axios.interceptors.request.use(config => {
  const token = store.userStore.token;
  // header! - turning off typescript to specify that we know that variable will be not null
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

/* Delaying Axios Response on development with Interceptors */
/* to intercept api response & do something with it */
axios.interceptors.response.use(
  async response => {
    /* try {
      if (process.env.NODE_ENV === "development") await sleep(1000);
      return response;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    } 
    */

    /* We don't want try/catch block like above now because we want to use second arg - onRejected */

    await sleep(1000);
    return response;
  },
  /* onRejected - to handle Server Error Responses */
  /* intercepting error response */
  (err: AxiosError) => {
    // data - errors object
    // status - http codes
    // config - http methods with 'config.method'
    const { data, status, config } = err.response!; // ! - turning off TS on this line
    console.log(err.response);

    // depending on Http Codes to handle error response
    switch (status) {
      // passing Error Messages from error object

      case 400:
        // bad request - Default
        if (typeof data === "string") {
          toast.error(data);
        }

        // invalid id
        // re-directing 400 to 404 to make it logical for the user
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }

        // Validation Errors from the backend for our forms,
        // if data contains the errors object
        if (data.errors) {
          const modalStateErrors = [];

          // errors object - key: ['']
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }

          /* throw this array list as the response object back to the http call */
          // [Array(1), Array(1), Array(1), Array(1), Array(1), Array(1)]
          throw modalStateErrors.flat();
        }

        // note: this code is placed on the top - typeof data === "string"
        // else {
        //   toast.error(data);
        // }
        break;
      case 401:
        // not authorized
        toast.error("unauthorized");
        break;
      case 404:
        // not found
        history.push("/not-found");
        break;
      case 500:
        // note - STORING API Error in mobx store
        // stack trace for dev env
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }

    return Promise.reject(err);
  }
);

/* <T> is generic type for an axios response   */
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

/* Http calls */
const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

/* Activities Endpoints */
const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>("/activities", activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  patch: (activity: Activity) => requests.patch<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
};

/* User Auth endpoints */
const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) => requests.post<User>("/account/register", user),
};

/* Export Endpoints */
const agent = {
  Activities,
  Account,
};

export default agent;
