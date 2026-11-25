export type Topic = { id: string; label: string; query: string };

export const TOPICS: Topic[] = [
  { id: "top", label: "Top", query: "" },
  { id: "ai", label: "AI", query: "AI" },
  { id: "web", label: "Web", query: "javascript" },
  { id: "mobile", label: "Mobile", query: "mobile" },
  { id: "security", label: "Security", query: "security" },
  { id: "startups", label: "Startups", query: "startup" },
];
