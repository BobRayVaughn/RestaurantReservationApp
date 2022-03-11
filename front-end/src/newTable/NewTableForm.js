import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import {v4 as uuidv4} from "uuid";

const NewTableForm = ({ loadTables }) => {
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const defaultFormData = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const history = useHistory();


  const onChangeHandler = ({ target }) => {
    let value = target.value;
    if (target.name === "capacity") {
      value = Number(value);
    }
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const onCreateHandler = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await createTable({ data: { ...formData } });
        loadTables();
        history.push("/dashboard");
      } catch (e) {
        setError(e);
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    let isValid = true;

    // check if table name was provided
    if (formData.table_name === "") {
      errors.push({
        message: "Table Name cannot be left empty.",
      });
      isValid = false;
    }

    // check if table name is atleast 2 characters long
    if (formData.table_name.length < 2) {
      errors.push({
        message: "Table Name must be atleast 2 characters long.",
      });
      isValid = false;
    }

    // check if capacity was provided
    if (formData.capacity === "") {
      errors.push({
        message: "Capacity must not be left empty.",
      });
      isValid = false;
    } else if (isNaN(formData.capacity)) {
      // check if capacity is a number
      errors.push({
        message: "Capacity must be a number.",
      });
      isValid = false;
    } else {
      // check if capacity is atleast 1
      if (Number(formData.capacity) < 1) {
        errors.push({
          message: "Capacity must be atleast 1.",
        });
        isValid = false;
      }
    }

    setValidationErrors(errors);

    return isValid;
  };

  const onCancelHandler = () => {
    history.goBack();
  };

  return (
    <>
      <h2 className="mt-3 mb-5">Create Table</h2>

      {validationErrors.map((valError) => (
        <ErrorAlert key={uuidv4()} error={valError} />
      ))}

      <form onSubmit={onCreateHandler} className="w-50">
        <div className="form-group row">
          <label htmlFor="table_name" className="col-sm-2 col-form-label">
            Table Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="table_name"
              name="table_name"
              onChange={onChangeHandler}
              value={formData.table_name}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="capacity" className="col-sm-2 col-form-label">
            Capacity
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="capacity"
              name="capacity"
              onChange={onChangeHandler}
              value={formData.capacity}
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

export default NewTableForm;
