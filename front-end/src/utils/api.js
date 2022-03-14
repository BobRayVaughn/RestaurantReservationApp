import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


const headers = new Headers();
headers.append("Content-Type", "application/json");


async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}


export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value.toString()));
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function createReservation(newReservation) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  return await fetchJson(
    url,
    { method: "POST", headers, body: JSON.stringify(newReservation) },
    []
  );
}

export async function createTable(newTable) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { method: "POST", headers, body: JSON.stringify(newTable) }, []);
}

export async function seatReservation(tableId, updateData) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  return await fetchJson(url, { method: "PUT", headers, body: JSON.stringify(updateData) }, []);
}

export async function getReservationById(reservation_id) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers }, []);
}

export async function deleteReservationFromTable(tableId) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  return await fetchJson(url, { method: "DELETE", headers }, []);
}

export async function updateReservationStatus(reservation_id, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  return await fetchJson(
    url,
    { method: "PUT", headers, signal, body: JSON.stringify({ data: { status } }) },
    []
  );
}

export async function updateReservation(reservation_id, updateData, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(
    url,
    { method: "PUT", headers, signal, body: JSON.stringify(updateData) },
    []
  );
}