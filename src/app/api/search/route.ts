import { autocompleteUsers } from "@/data/user";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    const q = url.searchParams.get("q");
    const users = await autocompleteUsers(q);
    return new Response(JSON.stringify(users), {
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response("Internal error", { status: 500 });
  }
}
