import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { populateMatchingResorts } from "./SearchFormSlice";
import styles from "./SearchForm.module.css";

const SearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [radiusValue, setRadiusValue] = useState(0);
  const handleRadiusChange = (e) => {
    setRadiusValue(parseInt(e.target.value));
  };
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    // const radius = data.radius * 1000; //convert to meters
    const radius = radiusValue * 1000 // try using component state radius in order to bypass data handling bug in useform()-controlled radius-range-element
    const cityNState = data.location;
    const [city, state] = cityNState.split(" ").map((string) => string.trim());
    dispatch(populateMatchingResorts({ city, state, radius }));

  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.searchForm}>
      <Form.Group controlId="formBasicText">
        <Form.Label className={styles.formLabel}>
          Enter city and state:
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter location"
          {...register("location", { required: true })}
          isInvalid={errors.location}
          className={styles.formControl}
        />
        <Form.Control.Feedback type="invalid">
          Please enter your location.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formBasicRange">
        <Form.Label className={styles.formLabel}>Select a radius:</Form.Label>
        <Form.Control
          type="range"
          step="5"
          min="0"
          max="50"
          value={radiusValue}
          // {...register("radius", { required: true })}
          onChange={handleRadiusChange}
          isInvalid={errors.radius}
          className={styles.formControl}
        />
        <Form.Control.Feedback type="invalid">
          Please select a radius.
        </Form.Control.Feedback>
        <Form.Text className={styles.formLabel}>
          Current radius: {radiusValue} km
        </Form.Text>
      </Form.Group>
      <Button type="submit" className={styles.button}>
        SEND IT !!!
      </Button>
    </Form>
  );
};

export default SearchForm;
