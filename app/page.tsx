"use client";

import { useCompletion } from "ai/react";
import axios from "axios";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import friendliGopher from "./friendli-gopher.png";
import Image from "next/image";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    body: { text, error },
    onFinish: (prompt, completion) => setText(completion.trim()),
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="container flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-center">
        <Image
          src={friendliGopher}
          alt="FriendliAI Gopher"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold">AI golang playground</h1>
        <p className="text-gray-500">
          power by{" "}
          <a
            href="https://friendli.ai"
            target="_blank"
            rel="noreferrer"
            className="text-[#1D4CB1] underline"
          >
            FriendliAI
          </a>{" "}
          &{" "}
          <a
            href="https://sdk.vercel.ai"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            ▲ AI SDK
          </a>
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          handleSubmit(e);
          setInput("");

          setResult("");
          setError("");
        }}
      >
        <Textarea
          className={"h-96"}
          value={isLoading && completion.length > 0 ? completion.trim() : text}
          onChange={(e) => {
            if (!isLoading) setText(e.target.value);
          }}
          placeholder="It was a dark and stormy night..."
          aria-label="Text"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />

        <div className="px-3 py-4 w-full whitespace-pre-wrap min-h-10 bg-neutral-100 rounded-md">
          {error || result ? (
            error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>{result}</div>
            )
          ) : (
            <div className="text-neutral-300">
              Execution Result will appear here...
            </div>
          )}
        </div>

        <Input
          placeholder="Enter your prompt here... ✨"
          onChange={handleInputChange}
          value={input}
          aria-label="Prompt"
          required
        />

        <div className="flex items-center space-x-2">
          <Button
            aria-label="Submit"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>

          <Button
            disabled={codeLoading}
            className="w-full"
            onClick={async (e) => {
              e.preventDefault();
              setCodeLoading(true);

              setResult("");
              setError("");

              await axios.post("/api/code", { code: text }).then((res) => {
                if (res.data.code) {
                  setText(res.data.code);
                }

                if (res.data.error) {
                  setError(res.data.error);
                }

                if (res.data.result) {
                  setResult(res.data.result);
                }
              });

              setCodeLoading(false);
            }}
          >
            {codeLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RocketIcon className="mr-2 h-4 w-4" />
            )}
            Execution
          </Button>
        </div>
      </form>
    </div>
  );
}
