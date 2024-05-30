import axios from "axios";

interface GoCodeRunnerResponse {
  Body: string;
  Errors: string;
  Events: {
    Kind: string;
    Message: string;
  };
}

export interface runnerResponse {
  code: string;
  error: string;
  result: string;
  failed?: boolean;
}

export async function goCodeRunner({
  code,
}: {
  code: string;
}): Promise<runnerResponse> {
  if (code.startsWith("go")) {
    code = code.substring(2);
  } else if (code.includes("``go")) {
    code = code.split("```go")[1].split("```")[0];
  } else if (code.includes("```go")) {
    code = code.split("```go")[1].split("```")[0];
  } else if (code.includes("```")) {
    code = code.split("```")[1].split("```")[0];
  } else if (code.startsWith("``") && code.endsWith("``")) {
    code = code.substring(2, code.length - 2);
  } else {
    code = code;
  }

  const axiosInstance = axios.create({
    baseURL: "https://go.dev/_",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const result: runnerResponse = {
    code: code,
    error: "",
    result: "",
  };

  try {
    const fmtUrl = "/fmt";
    const fmtData = {
      body: code,
      imports: true,
    };

    const response = await axiosInstance.post(fmtUrl, fmtData);

    const formattedCode = response.data.Body;

    if (formattedCode === "") {
      result.error = response.data.Error;
      result.failed = true;
    } else {
      const compileUrl = "/compile";
      const compileData = {
        body: formattedCode,
        withVet: "true",
        version: "2",
      };

      const runResponse = await axiosInstance.post(compileUrl, compileData);

      let runResult = "";

      if (runResponse.data.Errors) {
        result.failed = true;
        result.error = runResponse.data.Errors;
      }

      runResponse.data.Events?.forEach(
        (event: GoCodeRunnerResponse["Events"]) => {
          if (event.Kind === "stdout") {
            runResult += event.Message;
          } else if (event.Kind === "stderr") {
            runResult += event.Message;
          } else {
            runResult += `${event.Kind}: ${event.Message}`;
          }
        }
      );

      result.result = runResult;
      result.code = formattedCode;
    }
  } catch (error: any) {
    result.error = error.message;
  }

  return result;
}
