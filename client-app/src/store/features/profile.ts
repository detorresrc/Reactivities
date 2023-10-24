import { Profile, UserActivity } from "@/models/profile";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

import useUserStore from "./user";
import { Photo } from "@/models/photo";
import useActivityStore from "./activity";
import agent from "@/lib/agent";


type State = {
  profile: Profile | null
  followings: Profile[] | null
  loading: boolean
  isUploading: boolean
  loadingFollowings: boolean
  userActivities: UserActivity[] | null
  loadingActivities: boolean
}

type Action = {
  loadProfile: (username: string) => void
  isCurrentUser: () => boolean
  uploadPhoto: (file: Blob) => Promise<Photo | null>
  setMainPhoto: (photo: Photo) => Promise<boolean>
  deletePhoto: (photo: Photo) => Promise<boolean>
  updateFollowing: (username: string, following: boolean) => Promise<boolean>
  loadFollowings: (predicate: string) => Promise<Profile[] | null>
  loadUserActivities: (username: string, predicate?: string) => Promise<UserActivity[] | null> 
}

const useProfileStore = create(immer<State & Action>(
  (set, get) => ({
    profile: null,
    followings: [],
    loading: false,
    isUploading: false,
    loadingFollowings: false,
    userActivities: [],
    loadingActivities: false,
    
    loadProfile: async (username) => {
      try{
        set(state => {
          state.loading = true;
        });

        const profile = await agent.Profiles.get(username);
        set(state => {
          state.loading = false;
          state.profile = profile;
        });
      }catch(error){
        console.log(error)
        set(state => {
          state.loading = false;
          state.profile = null;
        });
      }
    },

    isCurrentUser: () => {
      const { profile } = get();
      const { user } = useUserStore.getState();

      if( profile && user ){
        return profile.userName === user.username;
      }

      return false;
    },

    uploadPhoto: async (file) => {
      try{
        set(state => {
          state.isUploading = true;
        });

        const response = await agent.Profiles.uploadPhoto(file);
        const photo = response.data;

        set(state => {
          state.isUploading = false;
          
          if(state.profile) {
            state.profile.photos = [...state.profile.photos ?? [], photo];
          }
        });

        return photo;
      }catch(error){
        console.log(error)

        set(state => {
          state.isUploading = false;
        });
      }

      return null;
    },

    setMainPhoto: async (photo) => {
      try{
        set(state => {state.loading = true;});

        await agent.Profiles.setMainPhoto(photo.id);

        set(state => {
          const prevMain = state.profile?.photos?.find(p => p.isMain);
          if(prevMain)
            prevMain.isMain = false;
          const newMain = state.profile?.photos?.find(p => p.id === photo.id);
          if(newMain)
            newMain.isMain = true;

          const profile = state.profile;
          if(profile)
            profile.image = photo.url;

          state.loading = false;
          state.profile = profile;
        });

        useUserStore.getState().setImage(photo.url);

        return true;
      }catch(error){
        console.log(error);
        set(state => {state.loading = false;});
      }

      return false;
    },

    deletePhoto: async (photo) => {
      try {
        set((state) => {
          state.loading = true;
        });

        await agent.Profiles.deletePhoto(photo.id);

        set((state) => {
          state.loading = false;
          if (state.profile) {
            state.profile.photos = state.profile.photos?.filter((p) => p.id !== photo.id);
          }
        });

        return true;
      } catch (error) {
        console.log(error);
        set((state) => {
          state.loading = false;
        });
      }

      return false;
    },

    updateFollowing: async (username, following) => {
      try{
        set(state => {state.loading = true});

        await agent.Profiles.updateFollowing(username);
        useActivityStore.getState().updateAttendeeFollowing(username);

        set(state => {
          const { profile } = state;
          if(profile && profile.userName !== useUserStore.getState().user?.username && profile.userName !== username){
            following ? profile.followersCount++ : profile.followersCount--;
            profile.following = !profile.following;
          }
          if(profile && profile.userName === useUserStore.getState().user?.username){
            following ? profile.followingCount++ : profile.followingCount--;
          }
          const { followings } = state;
          followings?.forEach(profile => {
            if(profile.userName == username){
              profile.following ? profile.followersCount-- : profile.followersCount++;
              profile.following = !profile.following
            }
          });

          state.followings = followings;
          state.profile = profile;
        });

      }catch(error){
        console.log(error);
      }finally{
        set(state => {state.loading = false});
      }

      return false;
    },

    loadFollowings: async (predicate) => {
      try{
        set(state => {state.loading = true});

        const { profile } = get();
        if(profile==null) return null;

        const followings = await agent.Profiles.listFollowings(profile.userName, predicate);
        set(state => {
          state.followings = followings;
        });
      }catch(error){
        console.log({error})    
      }finally{
        set(state => {state.loading = false});
      }

      return null;
    },

    loadUserActivities: async (username, predicate) => {
      try{
        set(state => {
          state.loadingActivities = true;
        });

        const activities = await agent.Profiles.listActivities(username, predicate ?? '');
        set(state => {
          state.userActivities = activities;
        });

        return activities;
      }catch(error){
        console.log(error);
      }finally{
        set(state => {
          state.loadingActivities = false;
        });
      }

      return null;
    }

  })
))

export default useProfileStore;