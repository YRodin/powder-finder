import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "./UserSlice";

const LoginError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxError = useSelector((state) => state.user.error);

  // Determine if modal should be shown based on reduxError or location.pathname
  const [showModal, setShowModal] = useState(
    location.pathname === "/loginerror" || reduxError
  );

  // Extract the error query parameter
  const queryParams = new URLSearchParams(location.search);
  const errorFromUrlQuery = queryParams.get("error");

  // Select the appropriate error message
  let error;
  if (errorFromUrlQuery) {
    error = errorFromUrlQuery;
  } else if (reduxError) {
    switch (reduxError.status) {
      case 401:
        error = "Incorrect user name or password, please try again";
        break;
      case 422:
        error = "User name is in use, please try a different one";
        break;
      case 500:
        error = "Internal server error, please try again";
        break;
      default:
        error = "Oops, something went wrong";
        break;
    }
  }

  useEffect(() => {
    setShowModal(location.pathname === "/loginerror" || reduxError);
  }, [location.pathname, reduxError]);

  const handleClose = () => {
    setShowModal(false);
    dispatch(clearError());
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton className={styles.modalStyle}>
        <Modal.Title className={styles.centeredTitle}>
          Authentication Error
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>{error}</Modal.Body>
      <Modal.Footer className={styles.modalStyle}>
        <Button
          className={styles.fullWidthButton}
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginError;
