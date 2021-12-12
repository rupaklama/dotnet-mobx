import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
}

const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
};

export const StoreContext = createContext(store);

// custom hook to avoid keep importing useContext & StoreContext in all our components to access our store
export const useStore = () => {
  // return useContext(StoreContext) as typeof store;
  // same as above with different annotation
  return useContext<typeof store>(StoreContext);
};

// to pass into Provider in index.tsx
export default store;
