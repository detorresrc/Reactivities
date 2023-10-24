import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

import { ChatComment } from "@/models/comment";
import useUserStore from "./user";

/**
 * Represents the state of the comment feature in the application.
 */
type State = {
  comments: ChatComment[]
  hubConnection: HubConnection | null
}

/**
 * An object representing the available actions for the comment feature in the store.
 */
type Action = {
  createHubConnection : (activityId: string) => void
  stopHubConnection : () => void
  clearComments : () => void
  addComment : (comment: {body: string, activityId: string}) => Promise<boolean>
}

/**
 * A custom hook that creates a store for managing comments related to an activity.
 * The store provides methods for creating and stopping a SignalR hub connection,
 * clearing comments, and adding a comment to the store.
 *
 * @returns An object containing the store's state and actions.
 */
const useCommentStore = create(immer<State & Action>(
  (set, get) => ({
    comments: [],
    hubConnection: null,

    createHubConnection: (activityId) => {
      const hubConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_CHAT_URL+'?activityId=' + activityId, {
        accessTokenFactory: () => useUserStore.getState().user!.token
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

      set({
        hubConnection
      });

      hubConnection.start().catch(error => console.log("Error while establishing connection", error));

      hubConnection.on("LoadComments", (comments: ChatComment[]) => {
        comments.forEach(comment => comment.createdAt = new Date(comment.createdAt + "Z"));
        set(state => {
          state.comments = comments;
        });
      });

      hubConnection.on("ReceiveComment", (comment: ChatComment) => {
        comment.createdAt = new Date(comment.createdAt);

        set(state => {
          state.comments.unshift(comment);
        });
      });
    },

    stopHubConnection: () => {
      get().hubConnection?.stop().catch(error => console.log("Error while stopping connection", error));
    },

    clearComments: () => {
      get().hubConnection?.stop().then(_ => console.log("ChatHub Disconnected!")).catch(error => console.log("Error while stopping connection", error));

      set(state => {
        state.comments = [];
        state.hubConnection = null;
      })
    },

    addComment: async (comment) => {
      const { hubConnection } = get();
      try{
        await hubConnection?.invoke("SendComment", comment);

        return true;
      }catch(error){
        console.log(error);
      }

      return false;
    }
  })
))

export default useCommentStore;