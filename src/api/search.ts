import type { User } from "@/data/user";

export default async function search(
  query: string,
  signal: AbortSignal
): Promise<User[]> {
  const url = new URL("/api/search", window.location.origin);
  url.searchParams.set("q", query);
  const res = await fetch(url.toString(), { signal });
  if (res.status !== 200) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}
