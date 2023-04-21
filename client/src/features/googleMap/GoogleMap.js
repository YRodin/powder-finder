import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
// import keys from "../../config/keys/keys";
import { useSelector } from "react-redux";
import styles from "./GoogleMap.module.css";
import { ErrorNotificationModal } from "../utilities/ErrorNotificationModal";
import { animateScroll } from "react-scroll";
import Marker from "./Marker";

// console.log('API Key:', keys.GOOGLE_API_KEY);

export default function GoogleMap() {
  const { matchingResorts, searchRequested } = useSelector(
    (state) => state.resorts2Display
  );
  const userSearchCenterCoordinates = useSelector(
    (state) => state.resorts2Display.userSearchCenterCoordinates
  );
  let markers;
  if (matchingResorts.length > 0) {
    function descendingOrder(a, b) {
      return b.snowfallSumm - a.snowfallSumm;
    }
    markers = [...matchingResorts].sort(descendingOrder);
    let number = 0;
    markers = matchingResorts.map((resort) => {
      return (
        <Marker
          key={resort.place_id}
          lat={resort.coordinates.lat}
          lng={resort.coordinates.lon}
          name={resort.name}
          number={(number += 1)}
        />
      );
    });
  }

  const center = userSearchCenterCoordinates.latitude
    ? {
        lat: userSearchCenterCoordinates.latitude,
        lng: userSearchCenterCoordinates.longitude,
      }
    : {
        lat: 39.7392,
        lng: -104.9903,
      };
  const zoom = 10;
  // implement react-scroll to zoom on map when data is returned in response to user search
  useEffect(() => {
    if (matchingResorts && matchingResorts.length > 0) {
      animateScroll.scrollTo(
        document.getElementById("map-container").offsetTop,
        {
          duration: () => 1,
          smooth: true,
        }
      );
    }
  }, [matchingResorts]);

  return (
    <div className={styles.googleMap} style={{height: '520px'}} id="map-container">
      {matchingResorts.length > 0 ? (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
          center={center}
          zoom={zoom}
          // onClick={handleClickOutside}
        >
          {markers}
        </GoogleMapReact>
      ) : (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
          center={center}
          zoom={zoom}
          // onClick={handleClickOutside}
        >
          {searchRequested && <ErrorNotificationModal />}
        </GoogleMapReact>
      )}
    </div>
  );
}
