import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";

export interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
}

const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
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
