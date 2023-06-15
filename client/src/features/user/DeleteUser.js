import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, closeDeleteUserModal } from "./UserSlice";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./User.module.css";
import { useNavigate }  from "react-router-dom";

const DeleteUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, showDeleteUserModal } = useSelector((state) => state.user);

  function submitHandler() {
    dispatch(deleteUser());
    dispatch(closeDeleteUserModal());
    navigate("/")
  }
  const handleHide = () => {
    dispatch(closeDeleteUserModal());
  };
  const showModal = showDeleteUserModal;
  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title className={styles.centeredTitle}>Sure you want to leave us? Our server will miss your data! </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Button variant="primary" type="button" onClick={submitHandler} className={styles.fullWidthButton}>
          Shred everything!
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteUser;
