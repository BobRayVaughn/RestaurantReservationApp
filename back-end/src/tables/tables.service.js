const knex = require("../db/connection");

//list tables
function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

//read tables
function read(table_id) {
    return knex("tables")
    .select("*")
    .where("table_id", table_id)
    .first()
}

//create new table
function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((newTable) => newTable[0])
}

function update(reservation_id, table_id) {
    return knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .then(() => {
        return knex("tables")
          .where({ table_id })
          .update({ reservation_id })
          .returning("*");
      });
  }

//close out table and make available
function closeTable(table_id, reservation_id) {
    return knex("reservations")
      .where({ reservation_id })
      .update({ status: "finished" })
      .returning("*")
      .then(() => {
        return knex("tables")
          .where({ table_id })
          .update({ reservation_id: null })
          .returning("*")
      });
  }



module.exports = {
    list,
    read,
    create,
    update,
    closeTable
}