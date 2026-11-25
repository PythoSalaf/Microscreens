import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Session, User } from "../types/user";

const secureStorage = createJSONStorage(() => ({
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}));

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
  seenOnboarding: boolean;
  finishOnboarding: () => void;
  replayOnboarding: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      signIn: ({ token, user }) => set({ token, user }),
      signOut: () => set({ token: null, user: null }),
      seenOnboarding: false,
      finishOnboarding: () => set({ seenOnboarding: true }),
      replayOnboarding: () =>
        set({ token: null, user: null, seenOnboarding: false }),
    }),
    {
      name: "auth-session",
      storage: secureStorage,
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        seenOnboarding: s.seenOnboarding,
      }),
      onRehydrateStorage: () => () => {
        useAuth.setState({ hydrated: true });
      },
    },
  ),
);
