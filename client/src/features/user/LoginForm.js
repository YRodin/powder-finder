import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "./UserSlice";
import { ErrorNotificationAlert } from "../utilities/ErrorNotificationAlert";
import { clearError, closeSignInModal, openSignUpModal } from "./UserSlice";
import styles from "./User.module.css";
import { ButtonGroup } from "react-bootstrap";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const { isLoggedIn, showSignInModal, showSignUpModal, error } = useSelector(
    (state) => state.user
  );
  // if user is logged in show modal
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(closeSignInModal());
    }
  }, [isLoggedIn, dispatch]);

  const onSubmit = async function (data) {
    dispatch(signin(data));
    reset();
  };
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };
  const handleHide = () => {
    dispatch(clearError());
    dispatch(closeSignInModal());
  };

  const showModal = showSignInModal;

  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle } closeButton>
        <Modal.Title className={styles.centeredTitle} >Log in</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Button
            href={`${baseURL}/api/auth/google`}
            className={styles.fullWidthButton}
            variant="primary"
            type="submit"
          >
            Sign in with Google
          </Button>
          <div className={styles.separator}>
            <span>Or</span>
          </div>
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
          <ButtonGroup className={styles.fullWidthButton}>
            <Button variant="primary" type="submit">
              Log in
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                dispatch(closeSignInModal());
                dispatch(openSignUpModal());
              }}
            >
              Sign up
            </Button>
          </ButtonGroup>
          <ErrorNotificationAlert error={error} onClose={handleErrorDismiss} />
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
