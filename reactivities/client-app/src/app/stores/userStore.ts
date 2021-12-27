import { makeAutoObservable, reaction, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import store from "./store";

import { User, UserFormValues } from "../models/user";

/* Storing Auth User in our mobx store */
export default class UserStore {
  user: User | null = null;

  /* Get token from local storage when app loads & then 
     we can react if token value changes with mobx reaction
  */
  token: string | null = window.localStorage.getItem("jwt");

  isAppLoaded = false;

  refreshTokenTimeout: any;

  constructor() {
    makeAutoObservable(this);

    /* Here we are VALIDATING & Re-setting a token on change */
    /* mobx reaction occurs here - a side effects that happens automatically when something changes. */
    /* Note - this reaction only runs when there is a change to a token */
    reaction(
      // first param is what we want to react too - expression
      () => this.token,
      // second param we pass the token as a param to do something
      token => {
        if (token) {
          // if new token is created, set it in local storage & use it to persist auth
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  // Observables state updates Computed values which evaluates values lazily & cached them
  // This value could be cached until any of the observables that is used changes
  // note - this will hold the cached value of the Observable state
  get isLoggedIn() {
    return !!this.user;
  }

  //
  setIsAppLoaded = () => {
    this.isAppLoaded = true;
  };

  // On initial app load or re-load, we need to check if we have token in our local storage or not,
  // if there's a token, we will use that token to get User Object from our api - auth request
  // & store User Object in our mobx store.

  // Note - we need to do this because as soon as we refresh or reload,
  // all of our mobx store states will get RESET.
  // So, as soon as we refresh our page we no longer have User Object to get information from
  // & same with other Observables States in our store.
  // NOTE - So, we will do this with mobx feature - Reaction.

  // This needs to be call in our root component App.tsx because it is the component
  // that loads when our app first starts up.

  // NOTE - This method will go get the User that matches the token in the local storage
  // & our Mobx Reaction will VALIDATE the Token on change &
  // persist Authentication with the help of Axios Interceptor.
  getUser = async () => {
    try {
      const user = await agent.Account.current();

      runInAction(() => {
        // this.token = user.token;
        this.user = user;
      });

      // on new token, starts a timer
      this.startRefreshTokenTimer(user);
    } catch (err) {
      console.error(err);
    }
  };

  // login & set token
  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);

      runInAction(() => {
        this.token = user.token;
        this.user = user;
      });

      // on new token, starts a timer
      this.startRefreshTokenTimer(user);

      // re-direct user after login
      history.push("/activities");

      // close modal - calling action in another store to update our state
      store.modalStore.closeModal();
    } catch (err) {
      // to catch this error & display it in the login form
      throw err;
    }
  };

  // logout & remove token
  logout = () => {
    this.token = null;
    window.localStorage.removeItem("jwt");
    this.user = null;

    // re-direct to homepage
    history.push("/");
  };

  // register user
  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);

      runInAction(() => {
        this.token = user.token;
        this.user = user;
      });

      // on new token, starts a timer
      this.startRefreshTokenTimer(user);

      // re-direct user after login
      history.push("/activities");

      // close modal - calling action in another store to update our state
      store.modalStore.closeModal();
    } catch (err) {
      // to catch this error & display it in the login form
      throw err;
    }
  };

  // set new token & this will update our local storage as well
  refreshToken = async () => {
    // stop timer
    this.stopRefreshTokenTimer();

    try {
      const user = await agent.Account.refreshToken();

      runInAction(() => {
        this.user = user;

        this.token = user.token;
      });

      // note - when we have a new token, we will start timer
      this.startRefreshTokenTimer(user);
    } catch (err) {
      console.log(err);
    }
  };

  // check when our Token is about to Expire so that we can automatically go and refresh a token
  private startRefreshTokenTimer(user: User) {
    // accessing our token & get the contents of the token but decoded as well
    // because we want to check out the expiry date.
    // atob func is to get decoded token
    // split(".")[1] - second part of token from the http response payload
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    // to get the expiry time
    const expires = new Date(jwtToken.exp * 1000);
    // setting our timeout value to 60 secs before our token expires
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    // note - when we get to 60 secs prior to our token expiring,
    // we will attempt to refresh our token in the background
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  // to stop Refresh Token timer
  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  // to set profile image
  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  // to update display name
  setDisplayName = (name: string) => {
    if (this.user) this.user.displayName = name;
  };
}
