import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "./UserSlice";
import { ErrorNotificationAlert } from "../utilities/ErrorNotificationAlert";
import { clearError } from "./UserSlice";
import styles from "./User.module.css";

const LoginForm = () => {
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
  // if user is logged in go to /user
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/user");
    }
  }, [isLoggedIn]);

  const onSubmit = function (data) {
    dispatch(signin(data));
  };
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };
  const handleHide = () => {
    dispatch(clearError());
    navigate("/");
  };
  const customModalStyle = {
    content: {
      backgroundColor: "red",
    },
  };
  const showModal = location.pathname === "/user/login";

  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title>Log in</Modal.Title>
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
            {errors.userName && <p>This field is required</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", { required: "Required" })}
            />
            {errors.password && <p>This field is required</p>}
          </Form.Group>

          <Button variant="primary" type="submit" >
            Log in!
          </Button>
          <ErrorNotificationAlert error={error} onClose={handleErrorDismiss} />
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
