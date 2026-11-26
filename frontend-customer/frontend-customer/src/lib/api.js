import { requestReservation } from "../../mobile/shared/bookingApi.js";

export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  // When the website is opened on a phone over the LAN, use the same host
  // that served Vite instead of hard-coding localhost.
  const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${hostname || "localhost"}:4000`;
}

export function createReservation(payload) {
  return requestReservation(getApiBaseUrl(), payload);
}
