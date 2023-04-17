import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export function ErrorNotificationModal({ error, handleClose }) {
  return (
    <>
      <Modal show={!!error} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Looks like there are no matching ski resorts in the area of your
          choice, please try another location
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
