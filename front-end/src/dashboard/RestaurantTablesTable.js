import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { deleteReservationFromTable } from "../utils/api";
import RestaurantTableRecord from "./RestaurantTableRecord";

const RestaurantTablesTable = ({ tables, loadTables, refreshReservations }) => {
  const [error, setError] = useState(null);

  const onFinishHandler = async (table_id, reservation_id) => {
    const isOk = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

    if (isOk) {
      try {
        await deleteReservationFromTable(table_id);
        await loadTables();
        await refreshReservations();
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <h4 className="mt-5 mb-1">Tables</h4>
      <table className="table w-100">
        <thead className="thead-dark">
          <tr>
            <th>Table ID</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Finish</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <RestaurantTableRecord
              key={table.table_id}
              table={table}
              onFinishHandler={onFinishHandler}
            />
          ))}
        </tbody>
      </table>
      <ErrorAlert error={error} />
    </>
  );
};

export default RestaurantTablesTable;
