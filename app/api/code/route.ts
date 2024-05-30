import { goCodeRunner } from "./go-runner";

export async function POST(req: Request) {
  const { code } = await req.json();
  const result = await goCodeRunner({ code });

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
