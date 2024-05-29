from dotenv import load_dotenv
from openai import OpenAI

import json
import os

load_dotenv()
friendli_token = os.getenv("FLP_API_KEY")
endpoint = "https://inference-dev.friendli.ai/v1"


model = "mixtral-8x7b-instruct-v0-1"

client = OpenAI(base_url=endpoint,
                api_key=friendli_token)

tools = [
    {
        "type": "function",
        "function": {
            "name": "golang_playground",
            "description": "the function that runs the Go code",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "The Go program to run. The program should be a complete program, not a package, No comments required."
                    }
                },
                "required": [
                    "code"
                ]
            }
        }
    }
]


def chat_with_tool(messages):
    chat = client.chat.completions.create(
        model=model,
        messages=messages,
        tools=tools,
        max_tokens=1000,
        temperature=1.2,
    )

    try:
        toolcall = json.loads(str(
            chat.choices[0].message.tool_calls[0].function.arguments))
        code = toolcall["code"]

        if code.startswith("go"):
            code = code[2:]

        if "``go" in code:
            code = code.split("```go")[1].split("```")[0]
        elif "```go" in code:
            code = code.split("```go")[1].split("```")[0]
        elif "```" in code:
            code = code.split("```")[1].split("```")[0]
        else:
            code = code

    except Exception as e:
        print(chat.choices[0].message)
        print("===== Error =====")
        print("An error occurred while parsing the function arguments:", str(e))
        exit()

    func_kwargs = {
        "code": code
    }

    return chat, func_kwargs


def chat(messages):
    chat = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=1000,
    )

    return chat, chat.choices[0].message.content
