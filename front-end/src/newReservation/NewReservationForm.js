import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, getReservationById, updateReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import { v4 as uuidv4 } from "uuid";

const NewReservationForm = ({ loadReservations, date, refreshReservations }) => {
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const history = useHistory();

  const { reservation_id } = useParams();

  useEffect(() => {
    if (reservation_id) {
      getReservationById(reservation_id)
        .then((reservation) => {
          formatReservationDate(reservation);

          setFormData({
            first_name: reservation.first_name,
            last_name: reservation.last_name,
            mobile_number: reservation.mobile_number,
            reservation_date: reservation.reservation_date,
            reservation_time: reservation.reservation_time,
            people: reservation.people,
          });
        })
        .catch(setError);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
      });
    }
  }, [reservation_id]);

  const onChangeHandler = (event) => {
    const value = event.target.name === "people" ? Number(event.target.value) : event.target.value;

    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [event.target.name]: value,
      };
    });
  };

  const onCancelHandler = () => {
    history.goBack();
  };

  const onCreateHandler = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        if (reservation_id) {
          const updatedReservation = await updateReservation(reservation_id, {
            data: { ...formData, status: "booked" },
          });

          await refreshReservations();

          formatReservationDate(updatedReservation);
          history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
        } else {
          const createdReservation = await createReservation({
            data: { ...formData, status: "booked" },
          });

          formatReservationDate(createdReservation);

         
          if (createdReservation.reservation_date === date) {
            loadReservations();
          }

          history.push(`/dashboard?date=${createdReservation.reservation_date}`);
        }
      } catch (e) {
        setError(e);
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    const date = new Date(`${formData.reservation_date}T${formData.reservation_time}:00`);

    let isValid = true;


    if (date.getDay() === 2) {
      errors.push({
        message: "Reservation date cannot fall on a Tuesday.",
      });
      isValid = false;
    }


    const todayDate = new Date();
    if (date < todayDate) {
      errors.push({
        message: "Reservation date cannot be in the past.",
      });

      isValid = false;
    }

   
    const hours = date.getHours();
    const mins = date.getMinutes();
    if (hours < 10 || (hours === 10 && mins < 30)) {
      errors.push({
        message: "Cannot reserve a time before the restaurant opens at 10:30am",
      });

      isValid = false;
    }


    if ((hours === 21 && mins > 30) || (hours === 22 && mins < 30)) {
      errors.push({
        message: "Cannot reserve a time after 9:30 PM.",
      });

      isValid = false;
    }

  
    if (hours > 22 || (hours === 22 && mins >= 30)) {
      errors.push({
        message: "Cannot reserve a time after 10:30 PM.",
      });

      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };

  return (
    <>
      <h2 className="mt-3 mb-5">{reservation_id ? "Edit" : "Create"} Reservation</h2>
      {validationErrors.map((valError) => (
        <ErrorAlert key={uuidv4()} error={valError} />
      ))}
      <form onSubmit={onCreateHandler} className="w-50">
        <div className="form-group row">
          <label htmlFor="first_name" className="col-sm-2 col-form-label">
            First Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              onChange={onChangeHandler}
              value={formData.first_name}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="last_name" className="col-sm-2 col-form-label">
            Last Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              onChange={onChangeHandler}
              value={formData.last_name}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_date" className="col-sm-2 col-form-label">
            Reservation Date
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              onChange={onChangeHandler}
              value={formData.reservation_date}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="reservation_time" className="col-sm-2 col-form-label">
            Reservation Time
          </label>
          <div className="col-sm-10">
            <input
              type="time"
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              onChange={onChangeHandler}
              value={formData.reservation_time}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="people" className="col-sm-2 col-form-label">
            People
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              id="people"
              name="people"
              onChange={onChangeHandler}
              value={formData.people}
              min={1}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="mobile_number" className="col-sm-2 col-form-label">
            Mobile #
          </label>
          <div className="col-sm-10">
            <input
              type="tel"
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              onChange={onChangeHandler}
              placeholder="888-888-8888"
              value={formData.mobile_number}
              required
            />
          </div>
        </div>
        <div className="form-group col mt-5 p-0">
          <button className="btn btn-secondary mr-2" onClick={onCancelHandler}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <ErrorAlert error={error} />
    </>
  );
};

export default NewReservationForm;