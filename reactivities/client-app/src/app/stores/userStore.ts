import { makeAutoObservable, reaction, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";

import { User, UserFormValues } from "../models/user";

/* Storing Auth User in our mobx store */
export default class UserStore {
  user: User | null = null;

  /* Get token from local storage when app loads & then 
     we can react if token value changes with mobx reaction
  */
  token: string | null = window.localStorage.getItem("jwt");
  isAppLoaded = false;

  constructor() {
    makeAutoObservable(this);

    /* mobx reaction occurs here - a side effects that happens automatically when something changes. */
    /* Note - this reaction only runs when there is a change to a token */
    reaction(
      // first param is what we want to react too - expression
      () => this.token,
      // second param we pass the token to do something
      token => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  get isLoggedIn() {
    return !!this.user;
  }

  setToken = (token: string | null) => {
    // set token in local storage & also here in the mobx store
    // if (token) window.localStorage.setItem("jwt", token);
    this.token = token;
  };

  setIsAppLoaded = () => {
    this.isAppLoaded = true;
  };

  // Find auth user on initial app load or re-load
  // This needs to be done in our root component App.tsx because it is the component
  // that loads when our app first starts up.
  getUser = async () => {
    try {
      const user = await agent.Account.current();

      runInAction(() => {
        this.user = user;
      });
    } catch (err) {
      console.error(err);
    }
  };

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);

      runInAction(() => {
        this.setToken(user.token);
        this.user = user;
      });

      history.push("/activities");
    } catch (err) {
      throw err;
    }
  };

  logout = () => {
    this.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    history.push("/");
  };
}
