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
  apiKey: process.env.FRIENDLI_TOKEN,
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
    model: friendliai("meta-llama-3.1-8b-instruct"),
    prompt: `Prompt: ${prompt}\nCode: ${code}\n${
      error ? `Error: ${error}\n` : ""
    }${result ? `Result: ${result}\n` : ""}`,
    system: `Use only Go code.
    Do not include the prompt or otherwise preface your response.
    Do not enclose the response in quotes.`,
  });

  return response.toAIStreamResponse();
}
