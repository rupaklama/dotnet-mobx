import axios, { AxiosResponse } from "axios";
import { Activity } from "./../models/activity";

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

/* Delaying Axios Response on development with Interceptors */
/* to intercept api response & do something with it */
axios.interceptors.response.use(async response => {
  try {
    if (process.env.NODE_ENV === "development") await sleep(1000);
    return response;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
});

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

/* Export Endpoints */
const agent = {
  Activities,
};

export default agent;
