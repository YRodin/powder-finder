import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "./UserSlice";
import { clearError, closeSignUpModal } from "./UserSlice";
import Modal from "react-bootstrap/Modal";
import styles from "./User.module.css";

function SignUpForm(props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { isLoggedIn, showSignUpModal, error } = useSelector((state) => state.user);
  const showModal = showSignUpModal;

  useEffect(() => {
   if (isLoggedIn) {
    dispatch(closeSignUpModal());
   }
  }, [isLoggedIn, dispatch]);

  const onSubmit = (data) => {
    dispatch(signup(data));
    dispatch(closeSignUpModal());
    reset();
  };
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };
  const hideHandler = () => {
    dispatch(clearError());
    dispatch(closeSignUpModal());
  };
  return (
    <Modal show={showModal} onHide={hideHandler}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title className={styles.centeredTitle}>Sign Up</Modal.Title>
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
          <Button variant="secondary" type="submit" className={styles.fullWidthButton}>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SignUpForm;
