import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";

import agent from "../api/agent";

import { Activity } from "./../models/activity";

class ActivityStore {
  // observables state
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  isLoadingInitial = true;

  constructor() {
    // using 'makeAutoObservable' don't require to pass down 'observable' & 'action' as second arg object - ,{}
    makeAutoObservable(this);
  }

  // ACTIONS
  loadActivities = async () => {
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

        // The reason for doing this is every step (tick) that updates observables in an
        // asynchronous process should be marked as action.
        // Any steps after await aren't in the same tick/step, so they require action wrapping.
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
  // by creating another action to wrap up 'isLoadingInitial' observable state
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
    id
      ? // edit
        this.selectActivity(id)
      : this.cancelSelectedActivity();
    this.isEditMode = true;
  };

  closeForm = () => {
    this.isEditMode = false;
  };

  createActivity = async (activity: Activity) => {
    this.isLoading = true;
    activity.id = uuid();

    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activities.push(activity);
        this.selectedActivity = activity;
        this.isEditMode = false;
        this.isLoading = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.isLoading = true;

    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
        this.selectedActivity = activity;
        this.isEditMode = false;
        this.isLoading = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.isLoading = true;

    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activities = [...this.activities.filter(a => a.id !== id)];

        if (this.selectedActivity?.id === id) this.cancelSelectedActivity();

        this.isLoading = false;
      });
    } catch (err) {
      console.error(err);

      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  // note - Computed values are use when doing operations on Observable state
  // such as filtering, expensive calculations etc. and cache it's output for optimization

  // computed property to return activities by date
  // Computed values can be used to derive information from other observables.
  // They evaluate lazily, caching their output and only recomputing if one of the underlying observables has changed.
  // computed - values marks as a getter that will derive new facts from the state and cache its output
  // Computed values can be created by annotating JavaScript getters with computed value
  get activitiesByDate() {
    return this.activities.slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }
}

export default ActivityStore;
