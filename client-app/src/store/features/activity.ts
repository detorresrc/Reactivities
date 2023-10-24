import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { immer } from 'zustand/middleware/immer'

import agent from "@/lib/agent";
import useUserStore from "./user";
import { Activity, ActivityFormValues } from "@/models/activity";
import { Profile } from "@/models/profile";
import { Pagination, PagingParams } from "@/models/pagination";

type State = {
  selectedActivity: Activity | undefined | null
  activityRegistry: Map<string, Activity>
  isEditMode: boolean
  isUpdating: boolean
  isLoading: boolean
  pagination: Pagination | null
  pagingParams: PagingParams
  predicate: Map<string, any>
  loadingInitial: boolean
};

type Action = {
  setSelectedActivity: (activity: Activity | null) => void;
  setActivities: (activities: Activity[]) => void;
  setEditMode: (isEditMode: boolean) => void;
  deleteActivity: (id: string) => Promise<boolean>;
  addActivity: (activity: ActivityFormValues) => Promise<Activity | null>;
  updateActivity: (activity: ActivityFormValues) => Promise<Activity | null>;
  setIsUpdating: (isUpdating: boolean) => void;
  loadActivities: () => Promise<Activity[] | null>;
  loadActivity: (id: string, forceRefresh?: boolean) => Promise<Activity | null>;
  getActivitiesGroupByDate: () => {[key: string] : Activity[]};
  updateAttendance: () => Promise<void>;
  changeStatusActivity: () => Promise<void>;
  clearActivity: () => void;
  updateAttendeeFollowing: (username: string) => void;
  setPagingParams: (pagingParams: PagingParams) => void;
  getAxiosParams: () => URLSearchParams;
  setPredicate: (predicate: string, value: string | Date) => void;
};

const useActivityStore = create(immer<State & Action>((set, get) => ({
  activityRegistry: new Map(),
  selectedActivity: null,
  isEditMode: false,
  isUpdating: false,
  isLoading: false,
  pagination: null,
  pagingParams: new PagingParams(),
  predicate: new Map().set('all', true),
  loadingInitial: false,

  setPagingParams: (pagingParams) => {
    set(state => {
      state.pagingParams = pagingParams;
    })
  },

  setPredicate: (predicate, value) => {
    set(state => {
      if(predicate=="") return;
      const { predicate: _predicate } = state;

      const resetPredicate = () => {
        _predicate.forEach((_, key) => {
          if(key !== 'startDate') _predicate.delete(key);
        });
      }

      switch(predicate) {
        case 'all':{
          resetPredicate();
          _predicate.set('all', true);
          break;
        }
        case 'isGoing': {
          resetPredicate();
          _predicate.set('isGoing', true);
          break;
        }
        case 'isHost': {
          resetPredicate();
          _predicate.set('isHost', true);
          break;
        }
        case 'startDate': {
          _predicate.delete('startDate');
          _predicate.set('startDate', value);
          break;
        }
      }

      state.predicate = new Map(_predicate);
      state.activityRegistry = new Map();
      state.pagingParams = new PagingParams();
    })
  },

  getAxiosParams : () => {
    const { pagingParams } = get();
    const params = new URLSearchParams();
    params.append('pageNumber', pagingParams.pageNumber.toString());
    params.append('pageSize', pagingParams.pageSize.toString());

    const { predicate } = get();
    predicate.forEach((val, key) => {
      if(key === 'startDate'){
        params.append(key, (val as Date).toISOString());
      }else {
        params.append(key, val);
      }
    });

    return params;
  },

  setSelectedActivity: (activity) => {
    set(state => {
      state.selectedActivity = activity;
    })
  },

  setActivities: (activities) => {
    set((state) => {
      state.activityRegistry = new Map(activities.map((activity) => [activity.id, activity]));
    })
  },

  setEditMode: (isEditMode) => {
    set((state) => {
      state.isEditMode = isEditMode;
    });
  },

  deleteActivity: async (id) => {
    try{
      set((state) => {
        state.isUpdating = true;
      });

      await agent.Activities.delete(id);

      set(state => {
        state.activityRegistry.delete(id);
        state.isUpdating = false;
      });

      return true;
    }catch(error){
      set((state) => {
        state.isUpdating = false;
      });
    }

    return false;
  },

  addActivity: async (activity) => {
    const user = useUserStore.getState().user;
    const attendee = new Profile(user!);
    try{
      activity.id = uuidv4();

      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];

      set(state => {
        const { activityRegistry } = state;
        activityRegistry.set(newActivity.id, newActivity);

        state.selectedActivity = newActivity;
        state.activityRegistry = activityRegistry;
      })

      return newActivity;
    }catch(error){
      console.log(error);
    }

    return null;
  },

  updateActivity: async (activity) => {
    try{
      await agent.Activities.update(activity);

      if(activity.id){
        const oldActivity = await get().loadActivity(activity.id, true);

        const updatedActivity = {
          ...oldActivity,
          ...activity
        } as Activity;
      
        set((state) => {
          state.activityRegistry.set(updatedActivity.id, updatedActivity);
          state.selectedActivity = updatedActivity;
        });

        return updatedActivity;
      }
      return null;
    }catch(error){
      return null;
    }
  },

  setIsUpdating(isUpdating) {
    set((state) => {
      state.isUpdating = isUpdating;
    });
  },

  loadActivities: async() => {
    set(state => {
      state.loadingInitial = true
    })

    try{
      const result = await agent.Activities.list( get().getAxiosParams() );
      const activities = result.data;

      set(state => {
        const { activityRegistry } = state;
        activities.forEach(activity => {
          _addActivityDetails(activity);
          activityRegistry.set(activity.id, {...activity, date: new Date(activity.date!) });
        });
        
        state.loadingInitial = false;
        state.pagination = result.pagination;
      });

      return activities;
    }catch(error){
      console.log(error);
      set(state => {
        state.loadingInitial = false
      })

      return null;
    }
    
  },

  loadActivity: async (id: string, forceRefresh = false) => {
    if(!forceRefresh){
      const activity = get().activityRegistry.get(id);
      if(activity){
        set((state) => {
          state.selectedActivity = activity;
        });

        return activity;
      }
    }

    try{
      set((state) => {
        state.isLoading = true
      });

      let activity = await agent.Activities.details(id);
      activity = {...activity, date: new Date(activity.date!)}

      _addActivityDetails(activity);

      set((state) => {
        state.isLoading = false;
        state.selectedActivity = activity;
      });

      return activity;
    }catch(error){
      console.error(error);
      return null;
    }finally{
      set((state) => {
        state.isLoading = false
      });
    }
  },

  getActivitiesGroupByDate: () => {
    const sortedActivities = Array.from(get().activityRegistry.values()).sort((a, b) => {
      return a.date!.getTime() - b.date!.getTime();
    });

    return sortedActivities.reduce((activities, activity) => {
      const date = format(activity.date!, "dd MMM yyyy");

      activities[date] = activities[date] ? [...activities[date], activity] : [activity];

      return activities;
    }, {} as {[key: string] : Activity[]});
  },

  updateAttendance: async () => {
    const { user } = useUserStore.getState();

    try{
      set((state) => {
        state.isLoading = true
      });

      if(!user) throw new Error("Invalid user");

      set(async (state) => {
        const selectedActivityId = state.selectedActivity?.id;
        if(selectedActivityId==null) throw new Error("Invalid activity");

        await agent.Activities.attend(''+selectedActivityId);
        const updatedActivity = await get().loadActivity(selectedActivityId, true);

        if(updatedActivity){
          state.activityRegistry.set(updatedActivity.id, updatedActivity);
          state.selectedActivity = updatedActivity;
        }  
      });
    }catch(error){
      console.log(error)
    }finally{
      set((state) => {
        state.isLoading = false
      });
    }
  },

  changeStatusActivity: async () => {
    try{
      set((state) => {
        state.isLoading = true
      });

      const selectedActivity = get().selectedActivity;

      if(selectedActivity){
        await agent.Activities.attend(selectedActivity!.id);
      
        set((state) => {
          state.selectedActivity!.isCancelled = !state.selectedActivity!.isCancelled;
          state.activityRegistry.set(state.selectedActivity!.id, state.selectedActivity!);
        });
      }
    }catch(error){
      console.log(error)
    }finally{
      set((state) => {
        state.isLoading = false;
      });
    }
  },

  clearActivity: () => {
    set({selectedActivity: null});
  },

  updateAttendeeFollowing: (username) => {
    try{
      set(state => {
        const activities = state.activityRegistry;
        if(!activities) return null;

        activities.forEach(activity => {
          activity.attendees?.forEach(attendee => {
            if(attendee.userName == username){
              attendee.following ? attendee.followersCount-- : attendee.followersCount++;
              attendee.following = !attendee.following;
            }
          });
        });
        
        state.activityRegistry = activities;
      });
    }catch(error){
      console.log(error);
    }
  }
})));

const _addActivityDetails = (activity: Activity) => {
  const { user } = useUserStore.getState();
  if(user){
    activity.isGoing = activity.attendees!.some(
      a => a.userName === user?.username
    );
    activity.isHost = activity.hostUsername === user.username;
    activity.host = activity.attendees?.find(x => x.userName === activity.hostUsername);
  }
}

export default useActivityStore;
