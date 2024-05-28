
import requests


def go_code_runner(code):
    url = "https://go.dev/_/fmt?backend="

    data = {
        "imports": "true",
        "body": code
    }

    response = requests.post(url, data=data)

    if response.status_code == 200:
        formated_code = response.json()["Body"]
    else:
        return "Error to format code: " + response.status_code, ""

    if formated_code == "":
        return "", ""

    run_backend = "https://go.dev/_/compile?backend="

    data = {
        "body": formated_code,
        "withVet": "true",
        "version": "2"
    }

    response = requests.post(run_backend, data=data)

    if response.status_code == 200:
        output = response.json()
    else:
        return "Error to run code: " + response.status_code, ""

    if output["Errors"] != "":
        return output["Errors"], ""
    else:
        events = output["Events"]
        run_result = ""

        for event in events:
            if event["Kind"] == "stdout":
                run_result += event["Message"]
            elif event["Kind"] == "stderr":
                run_result += event["Message"]
            else:
                run_result += event["Kind"] + ": " + event["Message"]

        return run_result, formated_code
