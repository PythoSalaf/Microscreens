import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Density = "comfortable" | "compact";
export type TextSize = "small" | "medium" | "large";

export const TEXT_CLASSES: Record<TextSize, string> = {
  small: "text-xs leading-4",
  medium: "text-sm leading-5",
  large: "text-base leading-6",
};

type SettingsState = {
  defaultTopic: string;
  density: Density;
  textSize: TextSize;
  haptics: boolean;
  setDefaultTopic: (id: string) => void;
  setDensity: (d: Density) => void;
  setTextSize: (t: TextSize) => void;
  setHaptics: (on: boolean) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      defaultTopic: "top",
      density: "comfortable",
      textSize: "medium",
      haptics: true,
      setDefaultTopic: (defaultTopic) => set({ defaultTopic }),
      setDensity: (density) => set({ density }),
      setTextSize: (textSize) => set({ textSize }),
      setHaptics: (haptics) => set({ haptics }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
