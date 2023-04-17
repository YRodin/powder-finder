import React from "react";
import { Alert } from "react-bootstrap";

export function ErrorNotificationAlert({ error, onClose }) {
  if (!error) return null;
  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      <Alert.Heading>Error</Alert.Heading>
      <p>{error.message}</p>
    </Alert>
  );
}
