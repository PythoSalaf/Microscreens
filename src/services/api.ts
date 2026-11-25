import { Comment } from "../types/comment";
import { Story } from "../types/story";
import { stripHtml } from "../utils/stripHtml";

const BASE = "https://hn.algolia.com/api/v1";

type Hit = {
  objectID: string;
  title: string | null;
  url: string | null;
  author: string;
  points: number | null;
  num_comments: number | null;
};

type CommentNode = {
  id: number;
  author: string | null;
  text: string | null;
  children?: CommentNode[];
};

function toStory(h: Hit): Story {
  const url = h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`;
  return {
    id: h.objectID,
    title: h.title as string,
    url,
    domain: url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0],
    author: h.author,
    points: h.points ?? 0,
    comments: h.num_comments ?? 0,
  };
}

type Params = { search: string; topic: string; page: number };
export type StoriesPage = { stories: Story[]; page: number; nbPages: number };
export async function fetchStories(
  { search, topic, page }: Params,
  signal?: AbortSignal,
): Promise<StoriesPage> {
  const term = search.trim();
  const q = [topic, term].filter(Boolean).join(" ");

  let url = `${BASE}/search?tags=front_page&hitsPerPage=20&page=${page}`;
  if (q) {
    const weekAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const recent = term
      ? ""
      : `&numericFilters=${encodeURIComponent(`created_at_i>${weekAgo}`)}`;
    url = `${BASE}/search?tags=story&query=${encodeURIComponent(q)}&hitsPerPage=20&page=${page}${recent}`;
  }

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Request failed");
  const data: { hits: Hit[]; page: number; nbPages: number } = await res.json();

  return {
    stories: data.hits.filter((h) => h.title).map(toStory),
    page: data.page,
    nbPages: data.nbPages,
  };
}
export async function fetchComments(
  id: string,
  signal?: AbortSignal,
): Promise<Comment[]> {
  const res = await fetch(`${BASE}/items/${id}`, { signal });
  if (!res.ok) throw new Error("Request failed");
  const data: { children?: CommentNode[] } = await res.json();

  return (data.children ?? [])
    .filter((c) => c.text && c.author)
    .slice(0, 15)
    .map((c) => ({
      id: String(c.id),
      author: c.author as string,
      text: stripHtml(c.text as string),
      replies: c.children?.length ?? 0,
    }));
}
