import { create } from "zustand";

type State = {
  error: ServerError | null
}

type Action = {
  setError: (error: ServerError) => void
}

const useErrorStore = create<State & Action>((set) => ({
  error: null,

  setError: (error) => {
    set((state) => ({
      ...state,
      error,
    }));
  }
}));

export default useErrorStore;