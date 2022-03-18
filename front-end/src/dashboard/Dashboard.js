import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery';
import { previous, next, today } from '../utils/date-time';
import ReservationsList from '../reservations/ReservationsList';
import Table from '../tables/Table';
import "./Dashboard.css"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */


function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const [tables, setTables] = useState([]);

  const history = useHistory();
  const query = useQuery().get('date');
  if (query) date = query;


  useEffect(loadDashboard, [date]);
  
  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }

  
  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleCurrentDateClick = () => {
    history.push(`dashboard?date=${today()}`)
  }

  return (
    <main>
      <div style={{alignItems: "center"}}>
      <h2>Reservations for {date}</h2>
      </div>
      <div className="btns">
        <button
          style={{ borderRadius: "15px", border: "none", marginRight: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="previous-date"
          onClick={handlePreviousDateClick}
        > Previous
        </button>
        <button
          style={{ borderRadius: "15px", border: "none", margin: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="previous-date"
          onClick={handleCurrentDateClick}
        > Today
        </button>
        <button
          style={{ borderRadius: "15px", border: "none", margin: "5px" }}
          type="button"
          className="btn btn-info"
          data-testid="next-date"
          onClick={handleNextDateClick}
        > Next
        </button>
      </div>
      <ErrorAlert error={error} />
      <ReservationsList reservations={reservations} />
      <Table tables={tables} />
    </main>
  );
}

export default Dashboard;