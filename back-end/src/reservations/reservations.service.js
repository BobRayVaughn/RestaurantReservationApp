const knex = require("../db/connection");

//list of all reservations
function list() {
    return knex("reservations")
      .select("*")
      .orderBy("reservation_time");
  };

  //list reservations by date
  function listDate(date) {
      return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .whereNot({ status: "finished" })
      .whereNot({ status: "cancelled" })
      .orderBy("reservation_time")
  };

  //create a reservation
  function create(reservation) {
      return knex("reservations")
      .insert(reservation, "*")
      .then((newRes) => newRes[0]);
  };

//read reservations - just scan through them
function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first()
};


//update reservation
function update(updatedReservation) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((res) => res[0])
};

//update status of res (seated, booked, finished)
function updateStatus(reservation_id, status) {
    return knex("reservations")
    .where({ reservation_id })
    .update({ status })
    .then(() => read(reservation_id))
};

//search by mobile_number
function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }


  module.exports = {
      list,
      listDate,
      create,
      read,
      update,
      updateStatus,
      search
  }