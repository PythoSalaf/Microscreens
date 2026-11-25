import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchStories } from "../services/api";
import { Story } from "../types/story";

type Status = "loading" | "success" | "error";

export function useStories(search: string, topic: string) {
  const query = useInfiniteQuery({
    queryKey: ["stories", { search, topic }],
    queryFn: ({ pageParam, signal }) =>
      fetchStories({ search, topic, page: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.page + 1 < last.nbPages ? last.page + 1 : undefined,
  });

  const stories = useMemo(() => {
    const seen = new Set<string>();
    const all: Story[] = [];
    for (const page of query.data?.pages ?? []) {
      for (const s of page.stories) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          all.push(s);
        }
      }
    }
    return all;
  }, [query.data]);

  const status: Status = query.data
    ? "success"
    : (query.isError && !query.isFetching) || query.fetchStatus === "paused"
      ? "error"
      : "loading";

  return {
    stories,
    status,
    reload: () => query.refetch(),
    retry: () => query.refetch(),
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
