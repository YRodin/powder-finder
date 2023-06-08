import React, { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router';
import { useNavigate } from "react-router-dom";

const LoginError = () => {
  const [showModal, setShowModal] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Authentication Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>Google authentication failed. Please try again.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginError;