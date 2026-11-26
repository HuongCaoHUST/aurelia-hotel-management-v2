/** Shared booking client used by the Vite website and the Expo app. */
export async function requestReservation(apiBaseUrl, payload) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Cannot connect to the booking server. Check the API address and make sure the server is running.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Could not save this reservation.');
  if (!result.reservation?.bookingCode) throw new Error('The server response did not include a booking code.');
  return result.reservation;
}
