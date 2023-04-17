import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "./UserSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./User.module.css";

const DeleteUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/user");
    }
  }, [isLoggedIn]);

  function submitHandler() {
    dispatch(deleteUser(token));
    navigate("/");
  }
  const handleHide = () => {
    navigate("/");
  };
  const showModal = location.pathname === "/user/delete";
  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Header className={styles.modalStyle} closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalStyle}>
        <Button variant="primary" type="button" onClick={submitHandler}>
          Bon Voyage!
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteUser;
