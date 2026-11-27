import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PillSelect from "../components/PillSelect";
import SegmentedControl from "../components/SegmentedControl";
import SettingsRow from "../components/SettingsRow";
import SettingsSection from "../components/SettingsSection";
import ToggleSwitch from "../components/ToggleSwitch";
import { TOPICS } from "../data/topics";
import { useHaptics } from "../hooks/useHaptics";
import { persister, queryClient } from "../lib/queryClient";
import { useAuth } from "../store/useAuth";
import { useSaved } from "../store/useSaved";
import { TEXT_CLASSES, useSettings } from "../store/useSettings";

const REPO_URL = "https://github.com/PythoSalaf/Microscreens";

export default function Settings() {
  const router = useRouter();
  const { tap } = useHaptics();

  const {
    defaultTopic,
    density,
    textSize,
    haptics,
    setDefaultTopic,
    setDensity,
    setTextSize,
    setHaptics,
  } = useSettings();

  const version = Constants.expoConfig?.version ?? "1.0.0";

  const clearCache = async () => {
    await persister.removeClient();
    await queryClient.resetQueries();
    Alert.alert("Cache cleared", "Fresh stories will load now.");
  };

  const resetSaved = () =>
    Alert.alert("Remove all saved stories?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => useSaved.setState({ saved: [] }),
      },
    ]);

  const replayOnboarding = () =>
    Alert.alert(
      "Replay onboarding?",
      "You'll be signed out and see the welcome screens again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Replay",
          onPress: () => {
            useAuth.setState({
              token: null,
              user: null,
              seenOnboarding: false,
            });
            router.replace("/");
          },
        },
      ],
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <View className="flex-row items-center px-6 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 items-center justify-center active:opacity-80"
        >
          <Ionicons name="chevron-back" size={22} color="#E2E8F0" />
        </Pressable>
        <Text className="text-3xl font-black text-white ml-4">Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 40,
        }}
      >
        <SettingsSection title="FEED">
          <SettingsRow
            icon="pricetag-outline"
            title="Default topic"
            subtitle="The feed opens on this topic"
            stacked
          >
            <PillSelect
              options={TOPICS.map((t) => ({ value: t.id, label: t.label }))}
              value={defaultTopic}
              onChange={(v) => {
                tap();
                setDefaultTopic(v);
              }}
            />
          </SettingsRow>

          <SettingsRow
            icon="albums-outline"
            title="Card density"
            subtitle="How many stories fit on screen"
            stacked
            last
          >
            <SegmentedControl
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
              value={density}
              onChange={(v) => {
                tap();
                setDensity(v);
              }}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="READING" delay={80}>
          <SettingsRow
            icon="text-outline"
            title="Reading size"
            subtitle="Comments on the story screen"
            stacked
            last
          >
            <SegmentedControl
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
              value={textSize}
              onChange={(v) => {
                tap();
                setTextSize(v);
              }}
            />
            <Text className={`mt-4 text-slate-300 ${TEXT_CLASSES[textSize]}`}>
              Preview: this is how comments will look on the story screen.
            </Text>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="FEEL" delay={160}>
          <SettingsRow
            icon="phone-portrait-outline"
            title="Haptic feedback"
            subtitle="Vibration on taps and bookmarks"
            last
          >
            <ToggleSwitch
              value={haptics}
              onChange={(v) => {
                setHaptics(v);
                if (v) Haptics.selectionAsync();
              }}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="DATA" delay={240}>
          <SettingsRow
            icon="trash-outline"
            title="Clear cached stories"
            subtitle="Frees space and loads fresh data"
            onPress={clearCache}
          />
          <SettingsRow
            icon="bookmark-outline"
            title="Remove all saved stories"
            danger
            onPress={resetSaved}
          />
          <SettingsRow
            icon="refresh-outline"
            title="Replay onboarding"
            subtitle="Signs you out and shows the welcome screens"
            onPress={replayOnboarding}
            last
          />
        </SettingsSection>

        <SettingsSection title="ABOUT" delay={320}>
          <SettingsRow icon="information-circle-outline" title="Version">
            <Text className="text-slate-400">{version}</Text>
          </SettingsRow>
          <SettingsRow
            icon="logo-github"
            title="Source code"
            subtitle="See how it's built"
            onPress={() => Linking.openURL(REPO_URL)}
            last
          />
        </SettingsSection>

        <Text className="text-center text-xs text-slate-600 mt-2">
          Day 8 of 50 · Built in public
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
