"use client";

import { useCompletion } from "ai/react";
import axios from "axios";
import { useState } from "react";
// import TextareaAutosize from "react-textarea-autosize";
// import { toast } from "sonner";

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
    body: { text },
    onFinish: (prompt, completion) => setText(completion.trim()),
    // onError: (error) => toast.error(error.message),
  });

  return (
    <div>
      {error && (
        <div role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {result && (
        <div role="alert">
          <strong className="font-bold">Result: </strong>
          <span className="block sm:inline">{result}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          handleSubmit(e);
          setInput("");
        }}
      >
        <textarea
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

        <div>
          <input
            placeholder="Make the text more unique..."
            onChange={handleInputChange}
            value={input}
            aria-label="Prompt"
            required
          />

          <button aria-label="Submit" type="submit">
            {isLoading ? "loading" : "Generate"}
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
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
          </button>
        </div>
      </form>
    </div>
  );
}
