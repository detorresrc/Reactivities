import { router } from "@/app/router/Router";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

import agent from "@/lib/agent";
import useModalStore from "./modal";

type State = {
  user: User | null
  fbLoading: boolean
  token: string | null
}

type Action = {
  isLoggedIn: () => boolean
  login: (user: UserFormValues) => Promise<void>
  register: (user: UserFormValues) => Promise<void>
  logout: () => void
  setImage: (imageUrl: string) => void
  facebookLogin: (accessToken: string) => Promise<void>
  setToken: (token: string) => void
}

const useUserStore = create(
  persist(
    immer<State & Action>((set, get) => ({
      user: null,
      fbLoading: false,
      token: null,
    
      isLoggedIn: () => {
        return !!get().user;
      },

      setToken: (token: string) => {
        set(state => state.token=token);
      },

      login: async (user: UserFormValues) => {
        const _user = await agent.Account.login(user);
        set((state) => {
          state.user = _user;
          state.token = _user.token;
        });

        useModalStore.getState().closeModal();
        router.navigate('/activities');
      },

      register: async (user: UserFormValues) => {
        const _user = await agent.Account.register(user);
        set((state) => {
          state.user = _user;
          state.token = _user.token;
        });

        useModalStore.getState().closeModal();
        router.navigate('/activities');
      },
      
      logout: () => {
        set((state) => {
          state.user = null;
        });

        router.navigate('/');
      },

      setImage: (imageUrl) => {
        set((state) => {
          if (state.user) {
            state.user.image = imageUrl;
          }
        })
      },

      facebookLogin: async (accessToken) => {
        try{
          set(state => { state.fbLoading = true });

          const user = await agent.Account.fbLogin(accessToken);
          set(state => {
            state.user = user;
            state.fbLoading = false;
            state.token = accessToken;
          });

          router.navigate('/activities');
        }catch(error){
          console.log(error);
          set(state => {
            state.fbLoading = false;
          });
        }
      },

     })),
     {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
     }
  )
)

export default useUserStore;