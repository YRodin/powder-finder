import React from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "./UserSlice";
import { useNavigate, Link } from "react-router-dom";
import { ErrorNotificationAlert } from "../utilities/ErrorNotificationAlert";
import { clearError } from "./UserSlice";
import { useLocation } from "react-router";
import Modal from "react-bootstrap/Modal";
import styles from "./User.module.css";

const EditUserForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, token } = useSelector((state) => state.user);
  const error = useSelector((state) => state.user.error);
  const showModal = location.pathname === "/user/edit";

  function handleDropdownChange(e) {
    setValue("seasonPass", e.target.value);
  }
  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  const handleHide = () => {
    dispatch(clearError());
    navigate("/");
  };

  function onSubmit(data) {
    // dispatch api Put request and save data in redux state
    const dataAndToken = { ...data, token };
    dispatch(editUser(dataAndToken));
    // redirect to home page
    navigate("/user");
  }
  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="textField">
            <Form.Label htmlFor="textField">Update User Name</Form.Label>
            <Form.Control
              type="userName"
              placeholder={userName}
              {...register("userName")}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dropdownField">
            <Form.Label htmlFor="dropdownField">Update Season Pass</Form.Label>
            <Form.Control
              placeholder="Dropdown menu to be built"
              as="select"
              onChange={handleDropdownChange}
              {...register("seasonPass")}
            >
              <option value="ikon">ikon</option>
              <option value="epic">epic</option>
              <option value="indy">indy</option>
              <option value="mountainCollective">mountainCollective </option>
            </Form.Control>
          </Form.Group>

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

          <Button variant="primary" type="submit">
            Apply Changes
          </Button>
          <Button variant="danger" as={Link} to="/user/delete">
            Delete Account
          </Button>
          <ErrorNotificationAlert error={error} onClose={handleErrorDismiss} />
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserForm;
