"use client";

import React, { useState } from "react";
import { highlight } from "sugar-high";

import Markdown from "react-markdown";

const API_URL = "http://localhost:8000"; // Replace with your actual API endpoint

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BodyGoProgramGoProgramPost = {
  // Define the schema for your request body here, including required and optional fields
  // Example:
  question: "",
};

function MyComponent() {
  const [formData, setFormData] = useState(BodyGoProgramGoProgramPost);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState<any>(null);

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/go-program`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData), // Encode form data using URLSearchParams
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // // Handle successful response (e.g., display success message, update state)
      // console.log("Request successful:", await response.json()); // Replace with your logic

      setResponse(await response.json());
    } catch (error: any) {
      setError(error?.message); // Set error message for display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full gap-8 w-full flex flex-col justify-center items-center">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold">AI golang playground</h1>
        <p className="text-gray-500">power by friendliAI</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div className="grid w-full gap-2">
          <Textarea
            name="question"
            placeholder="question..?"
            value={formData.question}
            onChange={handleChange}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {response && (
        <div className="grid w-full gap-4">
          <code
            className="block p-4 bg-gray-100 rounded-md whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: highlight(response?.formated_code),
            }}
          />

          <div className="flex gap-4 flex-col w-full md:flex-row">
            <div className="flex flex-col gap-4 w-full">
              <label>Run Result</label>
              <code className="block p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
                {response?.run_result}
              </code>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <label>Retry Count</label>
              <code className="block p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
                {response?.retry_count}
              </code>
            </div>
          </div>
          <code className="block p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
            <Markdown
              components={{
                code: ({ children }) => {
                  return (
                    <code
                      className="bg-gray-300 px-2 py-0.5 rounded-md whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: highlight(children as string),
                      }}
                    />
                  );
                },
                pre: ({ children }) => {
                  return (
                    <pre className="bg-gray-300 p-4 rounded-md whitespace-pre-wrap">
                      {children}
                    </pre>
                  );
                },
              }}
            >
              {response?.message}
            </Markdown>
          </code>
        </div>
      )}
    </div>
  );
}

export default MyComponent;
