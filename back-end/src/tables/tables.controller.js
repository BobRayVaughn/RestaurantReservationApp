const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");
const resService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");


async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}


async function create(req, res, next) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}


async function update(req, res) {
  const { reservation_id } = req.body.data;
  const table_id = Number(req.params.table_id);
  const data = await tablesService.update(reservation_id, table_id);
  res.json({ data });
}


async function destroy(req, res) {
  const { table_id } = req.params;
  const { table } = res.locals;

  await tablesService.closeTable(table_id, table.reservation_id);
  res.status(200).json({});
}

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasOnlyValidProperties(req, res, next) {
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );


  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}


async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({
      status: 404,
      message: `${table_id} not found.`,
    });
  }
}


async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `You have a reservation_id`,
    });
  }

  const reservation = await resService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `${reservation_id} does not exist.` });
}

function hasData(req, res, next) {
  const data = req.body.data;
  if (data) {
    next();
  } else {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  }
}

function isValid(req, res, next) {
    const { data: { table_name, capacity } } = req.body;
      if (!table_name || table_name.length <= 1) {
        return next({
          status: 400,
          message: "'table_name' length must be at least 2 characters long.",
        });
      }
      if (capacity <= 0 || typeof capacity !== "number") {
        return next({
          status: 400,
          message: "capacity error: Cannot book a table for 0 people.",
        });
      }
      next();
}

function isValidUpdate(req, res, next) {
    const occupied = res.locals.table.reservation_id;
    const { status, people } = res.locals.reservation;
    const { capacity } = res.locals.table

    if (occupied) {
      return next({
        status: 400,
        message: `Table ${res.locals.table.table_id} is currently occupied.`,
      });
    }
    if (status === "seated") {
      return next({
        status: 400,
        message: `Already seated these guests.`,
      });
    }
    if (people > capacity) {
        return next({
          status: 400,
          message: `capacity error: Not enough seats.`,
        });
      }
      next();
}


function available(req, res, next) {
    const { table } = res.locals;
    if (table.reservation_id === null) {
      return next({
        status: 400,
        message: `table is not occupied`,
      });
    }
  
    next();
  }

const isMissing = hasProperties("table_name", "capacity")
const isUpdated = hasProperties("reservation_id")

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasData,
        isValid,
        hasOnlyValidProperties,
        isMissing,
        asyncErrorBoundary(create)
    ],
    update: [
        hasData,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        isUpdated,
        isValidUpdate,
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(tableExists),
        available,
        asyncErrorBoundary(destroy)
    ]
}