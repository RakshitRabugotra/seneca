import axios from "axios";

const apiUrl = "/api";

// Added proxy for the below url
// const apiUrl = "http://127.0.0.1:5000";

export const authClient = axios.create({
  baseURL: apiUrl + "/auth",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const llamaClient = axios.create({
  baseURL: apiUrl + "/ollama",
  headers: {
    "Content-Type": "application/json",
  },
});
