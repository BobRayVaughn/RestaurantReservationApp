const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const resService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];


function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));
    
    if(invalidFields.length) 
      return next({
        status: 400,
        message: `Invalid Field(s): ${invalidFields.join(", ")} `,
      });
    next();
  }

const isMissing = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);


async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (date) {
    res.json({ data: await resService.listDate(date) });
  } else if (mobile_number) {
    res.json({ data: await resService.search(mobile_number) });
  } else {
    res.json({ data: await resService.list() });
  }
}


async function create(req, res) {
  const newReservation = await resService.create(req.body.data);
  res.status(201).json({ data: newReservation });
}


async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}


async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await resService.updateStatus(reservation_id, status);
  res.json({ data });
}


async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await resService.update(updatedReservation);
  res.json({ data });
}


async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const foundReservation = await resService.read(reservationId);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `${reservationId} does not exist.`,
    });
  }
}


function isValid(req, res, next) {
  const { reservation_date, reservation_time, people } = req.body.data;
  let today = new Date();
  let day = `${reservation_date}  ${reservation_time}`;
  let resAsDate = new Date(day);
  const validNumber = Number.isInteger(people);

const timeFormat = /\d\d:\d\d/;
  const dateReg = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
console.log(reservation_time)
  if (reservation_time.match(timeFormat) === null) {
    return next({
      status: 400,
      message: `The reservation_time is not valid.`,
    });
  }

  if (!reservation_date.match(dateReg)) {
    return next({
      status: 400,
      message: `The reservation_date is not valid.`,
    });
  }
  if (resAsDate.getDay() === 2) {
    return next({
      status: 400,
      message: `The Restaurant is closed on Tuesdays.`,
    });
  }
  if (resAsDate < today) {
    return next({
      status: 400,
      message: "Reservation must be booked for future date.",
    });
  }
  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservation must be between 10:30AM and 9:30PM.",
    });
  }
  if (!validNumber || people <= 0) {
    return next({
      status: 400,
      message: "You cannot make a reservation for 0 people.",
    });
  }
  next();
}

function checkBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== "booked") {
      return next({
        status: 400,
        message: `Status must be either ${status}`,
      });
    }
  }
  next();
}

function validateFinish(req, res, next) {
  const finishedStatus = res.locals.reservation.status;
  if (finishedStatus === "finished") {
    return next({
      status: 400,
      message: `Status is finished - cannot be updated`,
    });
  }
  next();
}


function reservationStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished", "cancelled"];

  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Status must be either ${validStatus.join(
        ", "
      )}. You put '${status}'`,
    });
  }
  next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    isMissing,
    hasOnlyValidProperties,
    checkBooked,
    isValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    isMissing,
    
    isValid,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(reservationStatus),
    
    validateFinish,
    asyncErrorBoundary(updateStatus),
  ],
};