import { useQueryClient } from "@tanstack/react-query";
import { fetchComments } from "../services/api";

export function usePrefetchComments() {
  const client = useQueryClient();

  return (id: string) =>
    client.prefetchQuery({
      queryKey: ["comments", id],
      queryFn: ({ signal }) => fetchComments(id, signal),
    });
}
