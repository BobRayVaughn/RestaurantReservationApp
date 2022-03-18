import React from "react";
import { clearTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function Table({ tables }) {
  const history = useHistory();

  

  const handleClear = (table_id) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      clearTable(table_id, abortController.signal)
        .then(() =>
          history.push("/"))
        .catch((e) =>
          console.log(e.message));
      return () => abortController.abort();
    }
  }



  
  const tablesRows = (tables || []).map(({ reservation_id, table_id, capacity, table_name }) => {
    return (
      <tr key={table_id}>
        <th>{table_name}</th>
        <td>{capacity}</td>
        <td data-table-id-status={table_id}>{reservation_id ? "Occupied" : "Free"}</td>
        <td>{reservation_id && <button onClick={() => handleClear(table_id)} type="button" className="btn btn-dark" data-table-id-finish={table_id}>Finish</button>}</td>
      </tr>
    )
  })
  return (
    <div className="container-fluid">
      <h1 style={{ textAlign: "center" }}>Table List</h1>
      <div className="row no-gutters">
        <div className="col">
          <table className="table" style={{ padding: "0", alignItems: "center", justifyContent: "center" }}>
            <thead className="table-head" style={{ opacity: "70%", padding: "0" }}>
              <tr>
                <th scope="col" style={{ padding: "0" }}>Table</th>
                <th scope="col" style={{ padding: "0" }}>Capacity</th>
                <th scope="col" style={{ padding: "0" }}>Vacant?</th>
                <th scope="col" style={{ padding: "0" }}>Done</th>
              </tr>
            </thead>
            <tbody style={{ opacity: "80%" }}>
              {tablesRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table;