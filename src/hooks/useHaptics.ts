import * as Haptics from "expo-haptics";
import { useSettings } from "../store/useSettings";

export function useHaptics() {
  const enabled = useSettings((s) => s.haptics);

  return {
    tap: () => {
      if (enabled) Haptics.selectionAsync();
    },
    impact: () => {
      if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    success: () => {
      if (enabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  };
}
