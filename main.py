from runner import go_code_runner
from chat import chat_with_tool, chat

from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form
from typing import Annotated

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.post("/go-program")
def go_program(question:  Annotated[str, Form()], max_retries: Annotated[int, Form()] = 3):

    question = "Write a Go program that" + question

    messages = []

    messages.append(
        {
            "role": "user",
            "content": question
        }
    )

    max_retries = 3
    retry_count = 0
    run_result = ""

    while retry_count < max_retries and run_result == "":
        a1 = chat_with_tool(messages)
        runner_return = go_code_runner(a1[1]["code"])
        run_result = runner_return[0]
        formated_code = runner_return[1]
        retry_count += 1

        print("debug")

    if run_result == "":
        return JSONResponse(content={"error": "Error to run code",
                                     "message": "error",
                                     "run_result": "error",
                                     "retry_count": retry_count,
                                     "formated_code": formated_code})

    messages.append(
        {
            "role": "assistant",
            "tool_calls": [
                tool_call.model_dump()
                for tool_call in a1[0].choices[0].message.tool_calls
            ]
        }
    )

    messages.append(
        {
            "role": "tool",
            "content": str(run_result),
            "tool_call_id": a1[0].choices[0].message.tool_calls[0].id
        }
    )

    finally_message = chat(messages)[1]

    return JSONResponse(content={
        "message": finally_message,
        "run_result": run_result,
        "retry_count": retry_count,
        "formated_code": formated_code
    })
