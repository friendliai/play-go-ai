module.exports = {
  "petstore-file": {
    input: "http://localhost:8000/openapi.json",
    output: {
      baseUrl: "http://localhost:8000",

      target: "./generated/api.ts",
      schemas: "./generated/models",

      client: "swr",
      //  mock: true,

      // mode: "tags-split",
    },
  },
};
