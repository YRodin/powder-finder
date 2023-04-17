import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "./UserSlice";
import { useNavigate } from "react-router-dom";
import { ErrorNotificationAlert } from "../utilities/ErrorNotificationAlert";
import { clearError } from "./UserSlice";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router";
import styles from "./User.module.css";

function SignUpForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const error = useSelector((state) => state.user.error);
  const showModal = location.pathname === "/user/signup";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/user");
    }
  }, [isLoggedIn]);

  const onSubmit = (data) => {
    console.log(data);
    dispatch(signup(data));
    // if user is logged in go to /user
  };
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };
  const hideHandler = () => {
    dispatch(clearError());
    navigate("/");
  };
  return (
    <Modal show={showModal} onHide={hideHandler}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user name"
              {...register("userName", { required: "Required" })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", { required: "Required" })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <ErrorNotificationAlert error={error} onClose={handleErrorDismiss} />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SignUpForm;
