"use client";

import { useCompletion } from "ai/react";
import axios from "axios";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { TextareaVariants } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

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
    <div className="container mt-20 flex flex-col gap-20">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold">AI golang playground</h1>
        <p className="text-gray-500">power by friendliAI</p>
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
        <TextareaAutosize
          className={cn(TextareaVariants(), "max-h-96 resize-none")}
          value={isLoading && completion.length > 0 ? completion.trim() : text}
          onChange={(e) => {
            if (!isLoading) setText(e.target.value);
          }}
          placeholder="It was a dark and stormy night..."
          aria-label="Text"
          // cacheMeasurements
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />

        <Card className="px-2 py-2 w-full whitespace-pre-wrap min-h-10">
          {error || result ? (
            error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>{result}</div>
            )
          ) : (
            <div className="text-gray-500">Result will appear here...</div>
          )}
        </Card>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Make the text more unique..."
            onChange={handleInputChange}
            value={input}
            aria-label="Prompt"
            required
          />

          <Button aria-label="Submit" type="submit">
            {isLoading ? "loading" : "Generate"}
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();

              // setText("");
              setResult("");
              setError("");

              axios.post("/api/code", { code: text }).then((res) => {
                console.log(res.data);
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
            }}
          >
            {isLoading ? "loading" : "Run"}
          </Button>
        </div>
      </form>
    </div>
  );
}
