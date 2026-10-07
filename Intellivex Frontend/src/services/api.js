import axios from "axios";
import { rewriteMedia } from "./media";

/* VITE_API_URL may or may not end with "/" — normalise so paths join cleanly. */
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/?$/, "/");

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

/* Point uploaded-image URLs at a reachable host (see services/media.js). */
api.interceptors.response.use((response) => {
  response.data = rewriteMedia(response.data);
  return response;
});
