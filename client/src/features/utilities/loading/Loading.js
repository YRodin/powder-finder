import React, { useEffect } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import styles from "./Loading.module.css";

const Loading = () => {
  const isLoading = useSelector((state) => state.resorts2Display.isLoading);
  return (
    <div>
      {isLoading && (
        <ReactLoading
          type="cubes"
          color="rgba(214, 222, 232, 0.985)"
          height="10%"
          width="10%"
          className={styles.loadingContainer}
        />
      )}
    </div>
  );
};

export default Loading;
