import "../../global.css";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BrandSplash from "../components/BrandSplash";
import { DAY, persister, queryClient } from "../lib/queryClient";
import { useAuth } from "../store/useAuth";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const token = useAuth((s) => s.token);
  const hydrated = useAuth((s) => s.hydrated);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister, maxAge: DAY, buster: "v1" }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: "#020617" },
            }}
          >
            <Stack.Screen name="index" />

            <Stack.Protected guard={!token}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={!!token}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="story/[id]"
                options={{
                  animation: "slide_from_bottom",
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{ animation: "slide_from_right" }}
              />
            </Stack.Protected>
          </Stack>
        </PersistQueryClientProvider>

        {hydrated && !splashDone && (
          <BrandSplash onDone={() => setSplashDone(true)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
