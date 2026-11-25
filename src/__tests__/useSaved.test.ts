jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useSaved } from "../store/useSaved";
import { Story } from "../types/story";

const story = (id: string): Story => ({
  id,
  title: `Story ${id}`,
  url: `https://example.com/${id}`,
  domain: "example.com",
  author: "ada",
  points: 10,
  comments: 2,
});

beforeEach(() => {
  useSaved.setState({ saved: [] });
});

describe("useSaved", () => {
  it("saves a story", () => {
    useSaved.getState().toggle(story("1"));
    expect(useSaved.getState().saved).toHaveLength(1);
  });

  it("removes a story when toggled twice", () => {
    useSaved.getState().toggle(story("1"));
    useSaved.getState().toggle(story("1"));
    expect(useSaved.getState().saved).toHaveLength(0);
  });

  it("puts the newest saved story first", () => {
    useSaved.getState().toggle(story("1"));
    useSaved.getState().toggle(story("2"));
    expect(useSaved.getState().saved[0].id).toBe("2");
  });

  it("removes a story by id", () => {
    useSaved.getState().toggle(story("1"));
    useSaved.getState().toggle(story("2"));
    useSaved.getState().remove("1");
    expect(useSaved.getState().saved.map((s) => s.id)).toEqual(["2"]);
  });
});
