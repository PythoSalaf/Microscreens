import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileRow from "../components/ProfileRow";
import { useAuth } from "../store/useAuth";
import { useSaved } from "../store/useSaved";

export default function Profile() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const savedCount = useSaved((s) => s.saved.length);
  const router = useRouter();
  const replayOnboarding = useAuth((s) => s.replayOnboarding);

  if (!user) return null;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const confirmSignOut = () => {
    Alert.alert(
      "Sign out?",
      "You'll need to sign in again to read and save stories.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign out", style: "destructive", onPress: signOut },
      ],
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <View className="px-6 pt-4 pb-6 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold tracking-widest text-indigo-300">
            YOUR ACCOUNT
          </Text>
          <Text className="text-4xl font-black text-white mt-1">Profile</Text>
        </View>
        <Pressable
          onPress={() => router.push("/settings")}
          className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 items-center justify-center active:opacity-80"
        >
          <Ionicons name="settings-outline" size={22} color="#E2E8F0" />
        </Pressable>
      </View>

      <View className="px-6">
        <Animated.View
          entering={FadeInDown.springify().damping(14)}
          className="items-center mb-8"
        >
          <View className="w-24 h-24 overflow-hidden rounded-full">
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-3xl font-black text-white">{initials}</Text>
            </LinearGradient>
          </View>
          <Text className="mt-4 text-2xl font-bold text-white">{fullName}</Text>
          <Text className="mt-1 text-slate-400">@{user.username}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(120).springify().damping(14)}
          className="overflow-hidden border bg-slate-900 border-slate-800 rounded-3xl"
        >
          <ProfileRow
            icon="person-outline"
            label="Username"
            value={user.username}
          />
          <ProfileRow icon="mail-outline" label="Email" value={user.email} />
          <ProfileRow
            icon="bookmark-outline"
            label="Saved stories"
            value={String(savedCount)}
            last
          />
        </Animated.View>

        <Pressable
          onPress={() => {
            replayOnboarding();
            router.replace("/");
          }}
          className="flex-row items-center justify-center gap-2 mt-8 border rounded-full h-14 border-slate-800 bg-slate-900 active:opacity-80"
        >
          <Ionicons name="refresh-outline" size={20} color="#A5B4FC" />
          <Text className="text-base font-semibold text-indigo-300">
            Replay onboarding
          </Text>
        </Pressable>

        <Animated.View entering={FadeInDown.delay(240).springify().damping(14)}>
          <Pressable
            onPress={confirmSignOut}
            className="flex-row items-center justify-center gap-2 mt-8 border rounded-full h-14 border-red-500/40 bg-red-500/10 active:opacity-80"
          >
            <Ionicons name="log-out-outline" size={20} color="#F87171" />
            <Text className="text-base font-semibold text-red-400">
              Sign out
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
