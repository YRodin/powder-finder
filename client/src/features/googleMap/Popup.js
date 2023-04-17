import React, { useEffect } from "react";
import Overlay from "react-bootstrap/Overlay";
import styles from "./Popup.module.css";

const Popup = ({ name, lat, lng, target, onClose }) => {
  const getDirections = (event) => {
    event.stopPropagation();
    console.log(`getDirections is invoked!`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (target.current && !target.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, target]);

  return (
    <Overlay target={target} show={true} placement="top">
      {(props) => (
        <div
          id="tooltip-basic"
          className={`tooltip bs-tooltip-top custom-tooltip ${styles.popup}`}
          {...props}
        >
          <h3>{name}</h3>
          <div>
            <button className="btn btn-primary" onMouseDown={getDirections}>
              Get Directions
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default Popup;
