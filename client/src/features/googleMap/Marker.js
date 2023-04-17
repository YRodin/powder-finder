import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./GoogleMap.module.css";
import CustomMarker from "./custom_marker.svg";
import Popup from "./Popup";

const Marker = ({ key, lat, lng, name, number }) => {
  const [showPopup, setShowPopup] = useState(false);
  const target = useRef(null);
  const [activePopup, setActivePopup] = useState(null);
  const handleClickOutside = useCallback(
    (event) => {
      if (activePopup && !activePopup.contains(event.target)) {
        setActivePopup(null);
        setShowPopup(false);
      }
    },
    [activePopup]
  );

  const handleClick = () => {
    setShowPopup(!showPopup);
    setActivePopup(!showPopup ? target.current : null);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
  return (
    <div className={styles.marker} onClick={handleClick} ref={target}>
      <img src={CustomMarker} alt="Custom Marker" />
      <div className={styles.markerText}>
        <h5>{number}</h5>
        <span>{name}</span>
      </div>
      {showPopup && (
        <Popup
          name={name}
          lat={lat}
          lng={lng}
          target={target.current}
          onClose={handleClick}
          handleClickOutside={handleClick}
        />
      )}
    </div>
  );
};

export default Marker;
