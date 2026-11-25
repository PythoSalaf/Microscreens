import { useRouter } from "expo-router";
import { Story } from "../types/story";

export function useOpenStory() {
  const router = useRouter();

  return (s: Story) =>
    router.push({
      pathname: "/story/[id]",
      params: {
        id: s.id,
        title: s.title,
        url: s.url,
        domain: s.domain,
        author: s.author,
        points: String(s.points),
        comments: String(s.comments),
      },
    });
}
