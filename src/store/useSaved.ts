import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Story } from "../types/story";

type SavedState = {
  saved: Story[];
  toggle: (story: Story) => void;
  remove: (id: string) => void;
};

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggle: (story) => {
        const exists = get().saved.some((s) => s.id === story.id);
        set({
          saved: exists
            ? get().saved.filter((s) => s.id !== story.id)
            : [story, ...get().saved],
        });
      },
      remove: (id) => set({ saved: get().saved.filter((s) => s.id !== id) }),
    }),
    {
      name: "saved-stories",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
