import React from "react";
import { Container } from "react-bootstrap";
import styles from "./Writeup.module.css";
import { useSelector } from "react-redux";

const Writeup = () => {
  const { isLoggedIn, userName } = useSelector((state) => state.user);

  return (
    <Container className={styles.writeup}>
      <h1 className={styles.heading}>Powder Finder</h1>
      <p className={styles.paragraph}>
      {userName
              ? `Wonder where the deepest snow is, ${userName}?`
              : `Find Snowiest Resorts on your ski pass, log in or sign up to select your season pass`}
      </p>
    </Container>
  );
};

export default Writeup;
