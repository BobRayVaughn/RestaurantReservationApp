import React from "react";

const RestaurantTableRecord = ({ table, onFinishHandler }) => {
  const { table_id, table_name, capacity, reservation_id } = table;
  return (
    <tr>
      <td>{table_id}</td>
      <td>{table_name}</td>
      <td>{capacity}</td>
      <td>
        <span data-table-id-status={`${table_id}`}>{reservation_id ? "Occupied" : "Free"}</span>
      </td>
      <td>
        {reservation_id ? (
          <button onClick={() => onFinishHandler(table_id, reservation_id)} data-table-id-finish={table_id}>
            Finish
          </button>
        ) : null}
      </td>
    </tr>
  );
};

export default RestaurantTableRecord;
