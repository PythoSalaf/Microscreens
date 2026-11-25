import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../services/api";

type Status = "loading" | "success" | "error";

export function useComments(id: string) {
  const query = useQuery({
    queryKey: ["comments", id],
    queryFn: ({ signal }) => fetchComments(id, signal),
  });

  const status: Status = query.data
    ? "success"
    : (query.isError && !query.isFetching) || query.fetchStatus === "paused"
      ? "error"
      : "loading";

  return {
    comments: query.data ?? [],
    status,
    retry: () => query.refetch(),
  };
}
