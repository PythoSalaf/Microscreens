jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useSettings } from "../store/useSettings";

beforeEach(() => {
  useSettings.setState({
    defaultTopic: "top",
    density: "comfortable",
    textSize: "medium",
    haptics: true,
  });
});

describe("useSettings", () => {
  it("starts with sensible defaults", () => {
    const s = useSettings.getState();
    expect(s.defaultTopic).toBe("top");
    expect(s.density).toBe("comfortable");
    expect(s.textSize).toBe("medium");
    expect(s.haptics).toBe(true);
  });

  it("changes the default topic", () => {
    useSettings.getState().setDefaultTopic("ai");
    expect(useSettings.getState().defaultTopic).toBe("ai");
  });

  it("changes card density", () => {
    useSettings.getState().setDensity("compact");
    expect(useSettings.getState().density).toBe("compact");
  });

  it("changes reading size", () => {
    useSettings.getState().setTextSize("large");
    expect(useSettings.getState().textSize).toBe("large");
  });

  it("turns haptics off", () => {
    useSettings.getState().setHaptics(false);
    expect(useSettings.getState().haptics).toBe(false);
  });
});
