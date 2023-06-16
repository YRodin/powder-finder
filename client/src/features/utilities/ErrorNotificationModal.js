import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "../user/User.module.css"
export function ErrorNotificationModal({ error, handleClose }) {
  return (
    <>
      <Modal show={!!error} onHide={handleClose}>
        <Modal.Header closeButton className={styles.modalStyle}>
          <Modal.Title className={styles.centeredTitle}>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalStyle}>
          Looks like there are no matching ski resorts in the area of your
          choice, please try another location
        </Modal.Body>
        <Modal.Footer className={styles.modalStyle}>
          <Button variant="secondary" onClick={handleClose}  className={styles.fullWidthButton}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
