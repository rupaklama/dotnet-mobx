import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";

import agent from "../api/agent";

import { Activity } from "./../models/activity";

class ActivityStore {
  // observables state
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  isEditMode = false;
  isLoading = false;
  isLoadingInitial = false;

  constructor() {
    // using 'makeAutoObservable' don't require to pass down 'observable' & 'action' as second arg object - ,{}
    makeAutoObservable(this);
  }

  // ACTIONS
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
          // activity.date = activity.date.split("T")[0];
          // adding updated activity in our list
          // this.activities.push(activity);
          this.setActivity(activity);
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

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      // if we have an activity in our mobx state
      this.selectedActivity = activity;
      return activity;
    } else {
      // fetch activity & update our state
      this.isLoadingInitial = true;

      try {
        activity = await agent.Activities.details(id);
        // activity.date = activity.date.split("T")[0];
        // this.activities.push(activity);
        this.setActivity(activity);
        runInAction(() => {
          this.selectedActivity = activity;
        });
        this.setIsLoadingInitial(false);
        return activity;
      } catch (err) {
        console.error(err);
        this.setIsLoadingInitial(false);
      }
    }
  };

  // note - Private Helper methods which are also an Actions in mobx

  // to set date & create an activity
  private setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    this.activities.push(activity);
  };

  // to check if we have an activity in our mobx state with the given 'id'
  private getActivity = (id: string) => {
    return this.activities.find(a => a.id === id);
  };

  // note - alternate approach to solve above issue without using runInAction
  // by creating another action to wrap up 'isLoadingInitial' observable state
  setIsLoadingInitial = (state: boolean) => {
    this.isLoadingInitial = state;
  };

  createActivity = async (activity: Activity) => {
    this.isLoading = true;

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
        this.isLoading = false;
      });
    } catch (err) {
      console.error(err);

      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  // COMPUTED FUNCTIONS
  // note - Computed values are use when doing operations on Observable state
  // such as filtering, expensive calculations etc. and cache it's output for optimization

  // computed property to return activities by date
  // Computed values can be used to derive information from other observables.
  // They evaluate lazily, caching their output and only recomputing if one of the underlying observables has changed.
  // computed - values marks as a getter that will derive new facts from the state and cache its output
  // Computed values can be created by annotating JavaScript getters with computed value
  get activitiesByDate() {
    return this.activities.slice().sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  // new array of objects with key of activity date & value as array of activities created on that particular date
  // 2022-03-19: [Proxy, Proxy]
  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        // const date = format(activity.date!, "dd MMM yyyy");
        // date is the key
        const date = format(activity.date!, "dd MMM yyyy");
        // if we have another activity with this particular date, add it into the 'key' list of same date
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];

        return activities;
      }, {} as { [key: string]: Activity[] }) // type annotation - {2022-03-19: Array(1)}
    );
  }
}

export default ActivityStore;
