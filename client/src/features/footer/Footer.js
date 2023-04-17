import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <Container>
        <Nav className={styles.footerContent}>
          <Nav.Item>
            <Nav.Link
              className={styles.navLink}
              href="https://github.com/YRodin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/github-logo.svg" alt="GitHub" width="20" height="20" />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={styles.navLink}
              href="https://www.linkedin.com/in/rodincodin/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/linkedin-logo.svg" alt="LinkedIn" width="20" height="20" />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </div>
  );
};

export default Footer;