"use client";

import { useCompletion } from "ai/react";
import axios from "axios";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import friendliGopher from "@/public/friendli-gopher.png";
import Image from "next/image";

export default function Home() {
  const [codeLoading, setCodeLoading] = useState(false);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const {
    completion,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    body: { result, error, code },
    onFinish: (prompt, completion) => {
      setCode(completion.trim());
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 items-center">
        <Image
          src={friendliGopher}
          alt="FriendliAI Gopher"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold">AI golang playground</h1>
        <p className="text-gray-500">
          powered by{" "}
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
          className="h-44"
          value={isLoading ? completion : code}
          onChange={(e) => {
            if (!isLoading) setCode(e.target.value);
          }}
          readOnly={isLoading || codeLoading}
          placeholder={`package main

func main() {
  // The generated code will appear here...
}`}
        />

        <div className="px-3 py-4 w-full whitespace-pre-wrap h-32 bg-neutral-100 rounded-md max-h-32 overflow-y-scroll">
          {error || result ? (
            error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>{result}</div>
            )
          ) : (
            <div className="text-neutral-300">
              Execution result will appear here...
            </div>
          )}
        </div>

        <Input
          placeholder="Enter your prompt here... ✨"
          onChange={handleInputChange}
          value={input}
          required
        />

        <div className="flex items-center space-x-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>

          <Button
            disabled={codeLoading}
            className="w-full"
            onClick={async (e) => {
              e.preventDefault();
              setCodeLoading(true);

              const response = await axios.post("/api/code", { code });

              setError(response.data.error);
              setResult(response.data.result);

              if (!response.data.error) {
                setCode(response.data.code);
              }

              setCodeLoading(false);
            }}
          >
            {codeLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RocketIcon className="mr-2 h-4 w-4" />
            )}
            Execute
          </Button>
        </div>
      </form>
    </div>
  );
}
