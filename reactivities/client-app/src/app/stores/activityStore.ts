import { PagingParams } from "./../models/pagination";
import { format } from "date-fns";
import { makeAutoObservable, reaction, runInAction } from "mobx";

import agent from "../api/agent";
import { Pagination } from "../models/pagination";
import { Profile } from "../models/profile";

import { Activity, ActivityFormValues } from "./../models/activity";
import store from "./store";

class ActivityStore {
  // observables state
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();

  isEditMode = false;
  isLoading = false;
  isLoadingInitial = false;

  constructor() {
    // using 'makeAutoObservable' don't require to pass down 'observable' & 'action' as second arg object - ,{}
    makeAutoObservable(this);
  }

  // ACTIONS
  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  /* set pagination when loading activities */
  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
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
    const user = store.userStore.user;
    if (user) {
      // note - setting other properties inside Activity
      activity.isGoing = activity.attendees!.some(a => a.username === user.username);
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
    }

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

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);

      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (err) {
      console.error(err);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = { ...this.getActivity(activity.id), ...activity };
          this.activities = [
            ...this.activities.filter(a => a.id !== activity.id),
            updatedActivity as Activity,
          ];
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (err) {
      console.error(err);
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

  /* to update user attendance */
  updateAttendance = async () => {
    const user = store.userStore.user;
    this.isLoading = true;

    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            a => a.username !== user?.username
          );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activities.push(this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  /* to cancel activity */
  cancelActivityToggle = async () => {
    this.isLoading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activities.push(this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  /* to update attendee following status */
  updateAttendeeFollowing = (username: string) => {
    this.activities.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if (attendee.username === username) {
          // if following current user, unfollow on click & update the count
          // else follow user & update the count
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          // updating following flag - true or false
          attendee.following = !attendee.following;
        }
      });
    });
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
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

  get axiosParams() {
    // URLSearchParams interface defines utility methods to work with the query string of a URL
    const params = new URLSearchParams();
    // Appends a specified key/value pair as a new search parameter
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    // this.predicate.forEach((value, key) => {
    //   if (key === "startDate") {
    //     params.append(key, (value as Date).toISOString());
    //   } else {
    //     params.append(key, value);
    //   }
    // });
    return params;
  }
}

export default ActivityStore;
