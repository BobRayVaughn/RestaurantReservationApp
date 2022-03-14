import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservationForm from "../newReservation/NewReservationForm";
import NewTableForm from "../newTable/NewTableForm";
import SeatReservationForm from "../seatReservation/SeatReservationForm";
import { listReservations, listTables } from "../utils/api";
import SearchReservationsView from "../search/SearchReservationsView";


function Routes() {
  const urlDate = new URLSearchParams(useLocation().search).get("date");
  const date = urlDate || today();


  const [reservations, setReservations] = useState([]);

 
  const [reservationsError, setReservationsError] = useState(null);


  const [tables, setTables] = useState([]);


  const [tablesError, setTablesError] = useState(null);

  useEffect(loadReservations, [date]);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function refreshReservations() {
    setReservationsError(null);
    return listReservations({ date }).then(setReservations).catch(setReservationsError);
  }

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    return listTables(abortController.signal).then(setTables).catch(setTablesError);
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <NewReservationForm
          loadReservations={loadReservations}
          date={date}
          refreshReservations={refreshReservations}
        />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservationForm
          reservations={reservations}
          tables={tables}
          loadTables={loadTables}
          refreshReservations={refreshReservations}
        />
      </Route>
      <Route path="/reservations/new">
        <NewReservationForm loadReservations={loadReservations} date={date} />
      </Route>
      <Route path="/tables/new">
        <NewTableForm loadTables={loadTables} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          reservations={reservations}
          tables={tables}
          reservationsError={reservationsError}
          tablesError={tablesError}
          date={date}
          loadTables={loadTables}
          refreshReservations={refreshReservations}
        />
      </Route>
      <Route path="/search">
        <SearchReservationsView />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;