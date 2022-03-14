import { formatAsTime } from "./date-time";

function formatTime(reservation) {
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  return reservation;
}


export default function formatReservationTime(reservations) {
  return Array.isArray(reservations)
    ? reservations.map(formatTime)
    : formatTime(reservations);
}
