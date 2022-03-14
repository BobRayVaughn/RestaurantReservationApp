import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";
import ReservationRecord from "./ReservationRecord";

const ReservationsTable = ({ reservations, refreshReservations }) => {
  const [error, setError] = useState(null);
  const notFinishedReservations = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );

  const onCancelReservationHandler = async (reservation_id) => {
    const isOk = window.confirm("Do you want to cancel this reservation? This cannot be undone.");

    if (isOk) {
      try {
        await updateReservationStatus(reservation_id, "cancelled");
        await refreshReservations();
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>People</th>
              <th>Mobile #</th>
              <th>Status</th>
              <th>Seat</th>
              <th>Edit</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {notFinishedReservations.map((reservation) => (
              <ReservationRecord
                key={reservation.reservation_id}
                reservation={reservation}
                onCancel={onCancelReservationHandler}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ErrorAlert error={error} />
    </>
  );
};

export default ReservationsTable;