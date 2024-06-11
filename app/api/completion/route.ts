import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(10, "5 m"),
        analytics: true,
      })
    : false;

const friendliai = createOpenAI({
  apiKey: process.env.FRIENDLI_API_KEY,
  baseURL: "https://inference.friendli.ai/v1",
});

export async function POST(req: Request) {
  if (ratelimit) {
    const ip = req.headers.get("x-real-ip") ?? "local";
    const rl = await ratelimit.limit(ip);

    if (!rl.success)
      return new Response("Rate limit exceeded", { status: 429 });
  }

  const { prompt, result, error, code } = await req.json();
  if (!prompt) return new Response("Prompt is required", { status: 400 });

  const response = await streamText({
    model: friendliai("meta-llama-3-8b-instruct"),
    system:
      "You are a golang code editor. You will be given a prompt and a text to edit, which may be empty or incomplete. Edit the golang code to match the prompt, and only respond with the full edited version of the golang code - do not include any other information, context, or explanation. If you add on to the text, respond with the full version, not just the new portion. Do not include the prompt or otherwise preface your response. Do not enclose the response in quotes.",
    prompt: `Prompt: ${prompt}\nCode: ${code}\n${
      error ? `Error: ${error}\n` : ""
    }${result ? `Result: ${result}\n` : ""}`,
  });

  return response.toAIStreamResponse();
}
