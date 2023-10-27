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
  refreshTokenTimeout?: NodeJS.Timeout | null
}

type Action = {
  isLoggedIn: () => boolean
  login: (user: UserFormValues) => Promise<void>
  register: (user: UserFormValues) => Promise<void>
  logout: () => void
  setImage: (imageUrl: string) => void
  facebookLogin: (accessToken: string) => Promise<void>
  setToken: (token: string) => void
  refreshToken: () => Promise<void>
  startRefreshToken: () => void
  stopRefreshToken: () => void
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
        get().startRefreshToken();
        useModalStore.getState().closeModal();
        router.navigate('/activities');
      },

      register: async (user: UserFormValues) => {
        await agent.Account.register(user);

        useModalStore.getState().closeModal();
        router.navigate('/account/registration-success?email='+user.email);
      },
      
      logout: () => {
        set((state) => {
          state.user = null;
        });

        const { refreshTokenTimeout } = get();
        if(refreshTokenTimeout)
          clearTimeout(refreshTokenTimeout);

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

          get().startRefreshToken();
          router.navigate('/activities');
        }catch(error){
          console.log(error);
          set(state => {
            state.fbLoading = false;
          });
        }
      },

      refreshToken: async () => {
        try{
          get().stopRefreshToken();

          const user = await agent.Account.refreshToken();
          
          set(state => {
            state.user = user;
          });
          get().startRefreshToken();
        }catch(error){
          console.log(error);
        }
      },

      startRefreshToken: () => {
        if(get()?.user==null) return null;
        const { token } = get().user!;
        if(!token) return;

        const { refreshTokenTimeout: handler } = get();
        if(handler) clearTimeout(handler);

        const jwtToken = JSON.parse(atob(token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (30*1000);

        const refreshTokenTimeout = setTimeout(get().refreshToken, timeout);
        set(state => {
          state.refreshTokenTimeout = refreshTokenTimeout;
        })
      },

      stopRefreshToken: () => {
        clearTimeout(get().refreshTokenTimeout!);
        set(state => {
          state.refreshTokenTimeout = null;
        })
      }

     })),
     {
      name: 'user-store',
      storage: createJSONStorage(() => sessionStorage),
     }
  )
)

export default useUserStore;