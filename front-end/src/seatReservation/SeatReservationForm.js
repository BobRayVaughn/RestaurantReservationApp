import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservationById, seatReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import { v4 as uuidv4 } from "uuid";

const SeatReservationForm = ({
  reservations,
  tables,
  loadTables,
  refreshReservations,
  reservationToSeat,
}) => {
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [tableId, setTableId] = useState(0);
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState(null);

  const history = useHistory();

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setError(null);
    getReservationById(reservation_id, abortController.signal).then(setReservation).catch(setError);
    return () => abortController.abort();
  }

  const onChangeHandler = (event) => {
    setTableId(event.target.value);
  };

  const onCreateHandler = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await seatReservation(tableId, { data: { reservation_id } });
        await loadTables();
        await refreshReservations();
        formatReservationDate(reservation);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      } catch (e) {
        setError(e);
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    let isValid = true;

    const table = tables.find((table) => table.table_id === Number(tableId));


    if (reservation.people > table.capacity) {
      errors.push({
        message: "Party size exceeds table capacity.",
      });

      isValid = false;
    }


    if (table.reservation_id) {
      errors.push({
        message: "Table is already occupied.",
      });
      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };

  const onCancelHandler = () => {
    history.goBack();
  };

  return (
    <>
      <h2 className="mt-3 mb-5">Seat Reservation</h2>

      {validationErrors.map((valError) => (
        <ErrorAlert key={uuidv4()} error={valError} />
      ))}

      <form onSubmit={onCreateHandler} className="w-50">
        <div className="form-group row">
          <label htmlFor="table_id" className="col-sm-2 col-form-label">
            Table number
          </label>
          <div className="col-sm-10">
            <select
              className="form-select"
              id="table_id"
              name="table_id"
              onChange={onChangeHandler}
              value={tableId}
            >
              <option defaultValue={0}>Select table</option>
              {tables.map((table) => (
                <option key={table.table_id} value={table.table_id}>
                  {`${table.table_name} - ${table.capacity}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group col mt-5 p-0">
          <button className="btn btn-secondary mr-2" onClick={onCancelHandler}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <ErrorAlert error={error} />
    </>
  );
};

export default SeatReservationForm;