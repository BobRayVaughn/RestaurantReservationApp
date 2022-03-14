import React, { useState } from "react";
import ReservationsTable from "../dashboard/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

const SearchReservationsView = () => {
  const [matchedReservations, setMatchedReservations] = useState([]);
  const [error, setError] = useState(null);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [formMobileNumber, setFormMobileNumber] = useState("");

  const onChangeHandler = (event) => {
    setFormMobileNumber(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    setError(null);
    listReservations({ mobile_number: formMobileNumber })
      .then((results) => {
        setMatchedReservations(results);
        isSearchResultsEmpty(results);
      })
      .catch(setError);
  };

  const isSearchResultsEmpty = (results) => {
    setNoResultsFound(false);
    if (results.length === 0) {
      setNoResultsFound(true);
    }
  };

  return (
    <>
      <h2 className="mt-3 mb-5">Search</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="input-group">
          <input
            className="form-control col-3"
            type="text"
            name="mobile_number"
            id="mobile_number"
            placeholder="Enter a customer's phone number"
            onChange={onChangeHandler}
            value={formMobileNumber}
          />
          <button type="submit" className="btn btn-primary">
            Find
          </button>
        </div>
      </form>

      <hr style={{ borderTop: "1px solid black" }} className="mt-5" />

     
      <h5 className="my-3">Search Results</h5>
      <ErrorAlert error={error} />
      <ReservationsTable reservations={matchedReservations} />
      {noResultsFound ? <h6>No reservations found</h6> : null}
    </>
  );
};

export default SearchReservationsView;