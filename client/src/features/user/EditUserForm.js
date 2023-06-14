import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { ErrorNotificationAlert } from "../utilities/ErrorNotificationAlert";
import {
  editUser,
  clearError,
  closeSettingsModal,
  openDeleteUserModal,
} from "./UserSlice";
import Modal from "react-bootstrap/Modal";
import styles from "./User.module.css";

const EditUserForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const { userName, seasonPass, showSettingsModal, googleAuth } = useSelector(
    (state) => state.user
  );
  const error = useSelector((state) => state.user.error);

  const showModal = showSettingsModal;

  useEffect(() => {
    setValue("seasonPass", seasonPass || "");
  }, [seasonPass, setValue]);

  function handleDropdownChange(e) {
    setValue("seasonPass", e.target.value);
  }
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  const handleHide = () => {
    dispatch(clearError());
    dispatch(closeSettingsModal());
  };

  function onSubmit(data) {
    // Only include seasonPass in the user data if the user has made a change
    if (!data.seasonPass.startsWith("Current pass is: ")) {
      // Extract pass name from string
      let passName = data.seasonPass;
      if (passName !== "Please select a pass") {
        data.seasonPass = passName;
      }
    }
    // Dispatch API PUT request and save data in Redux state
    dispatch(editUser(data));
    dispatch(closeSettingsModal());
    reset();
  }
  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title className={styles.centeredTitle}>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {!googleAuth && (
            <Form.Group className="mb-3" controlId="textField">
              <Form.Label htmlFor="textField">Update User Name</Form.Label>
              <Form.Control
                type="userName"
                placeholder={userName}
                {...register("userName")}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="dropdownField">
            <Form.Label htmlFor="dropdownField">Update Season Pass</Form.Label>
            <Form.Control
              as="select"
              onChange={handleDropdownChange}
              {...register("seasonPass", { defaultValue: seasonPass || "" })}
            >
              <option value="">Please select a pass</option>
              <option value="ikon">ikon</option>
              <option value="epic">epic</option>
              <option value="indy">indy</option>
              <option value="mountainCollective">mountainCollective </option>
            </Form.Control>
          </Form.Group>

          {!googleAuth && (
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label htmlFor="formBasicPassword">
                Update your Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </Form.Group>
          )}
          <ButtonGroup className={styles.fullWidthButton}>
            <Button variant="primary" type="submit">
              Apply Changes
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch(closeSettingsModal());
                dispatch(openDeleteUserModal());
              }}
            >
              Delete Account
            </Button>
          </ButtonGroup>
          <ErrorNotificationAlert error={error} onClose={handleErrorDismiss} />
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserForm;
