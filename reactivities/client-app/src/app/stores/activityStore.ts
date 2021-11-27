import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";

import { Activity } from "./../models/activity";

class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  isLoadingInitial = false;

  constructor() {
    // using 'makeAutoObservable' don't require to pass down 'observable' & 'action' as second arg object - ,{}
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.isLoadingInitial = true;

    // note - async code goes inside try/catch
    try {
      // note - we can mutate data directly in mobx
      const activities = await agent.Activities.list();

      // Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed
      // To resolve above issue when using async/await syntax, runInAction()
      // https://mobx.js.org/actions.html#asynchronous-actions
      runInAction(() => {
        // updating state
        activities.forEach(activity => {
          // modifying date
          activity.date = activity.date.split("T")[0];
          // adding updated activity in our list
          this.activities.push(activity);
        });
        this.isLoadingInitial = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => {
        this.isLoadingInitial = false;
      });

      // note - if not using runInAction
      // this.setIsLoadingInitial(false)
    }
  };

  // note - alternate approach to solve above issue without using runInAction
  // by creating another action for isLoadingInitial
  setIsLoadingInitial = (state: boolean) => {
    this.isLoadingInitial = state;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find(a => a.id === id);
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.isEditMode = true;
  };

  closeForm = () => {
    this.isEditMode = false;
  };
}

export default ActivityStore;
