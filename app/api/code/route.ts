import axios from "axios";

export interface Response {
  code: string;
  error: string;
  result: string;
}

interface Events {
  Kind: string;
  Message: string;
}

const instance = axios.create({
  baseURL: "https://go.dev/_",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export async function POST(req: Request) {
  const { code } = await req.json();
  const result: Response = { code: "", error: "", result: "" };

  const fmtResponse = await sendRequest("/fmt", {
    body: code,
    imports: true,
  });

  if (fmtResponse.Error) {
    result.error = fmtResponse.Error;
    return sendResponse(result);
  }

  result.code = fmtResponse.Body;

  const runResponse = await sendRequest("/compile", {
    body: result.code,
    withVet: "true",
    version: "2",
  });

  if (runResponse.Errors) {
    result.error = runResponse.Errors;
    return sendResponse(result);
  }

  runResponse.Events?.forEach((event: Events) => {
    result.result += event.Message;
  });

  return sendResponse(result);
}

async function sendRequest(url: string, data: any) {
  const response = await instance.post(url, data);
  return response.data;
}

async function sendResponse(response: Response) {
  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
