import React, { useEffect, useState, useRef } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../user/UserSlice";
import styles from "./Navbar.module.css";
import logo from "./powderFinderLogo.png";
import { openSingInModal, openSettingsModal, openSignUpModal } from "../user/UserSlice";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const NavBar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userName } = useSelector((state) => state.user);
  const location = useLocation();

  // control visibility of expanded navbar.collapse element and make it dissapear on user click elsewhere on screen
  const navBarRef = useRef(null);
  const [navExpanded, setNavExpanded] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navBarRef.current && !navBarRef.current.contains(event.target)) {
        setNavExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Navbar
      variant="dark"
      expand="md"
      fixed="top"
      className={styles.navbar}
      ref={navBarRef}
      expanded={navExpanded}
      onToggle={() => setNavExpanded(!navExpanded)}
    >
      <Container className={styles.navContainer}>
        <Navbar.Brand as={Link} to="/">
          <img className={styles.logo} src={logo} alt="PF" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={`${styles.navItems} ${styles.slidingNavContainer}`}
        >
          <Nav className={styles.centeredNavItems}>
            <Nav.Item>
              {!isLoggedIn && (
                <Nav.Link
                  className={styles.slidingNavLink}
                  onClick={
                    () => {
                      dispatch(openSingInModal())
                      setNavExpanded(false)}}
                >
                  Sign in
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link
                  className={styles.slidingNavLink}
                  onClick={() => {
                    dispatch(openSettingsModal())
                    setNavExpanded(false)}}
                >
                  User Settings
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link
                  onClick={() => {
                    dispatch(signOut());
                    setNavExpanded(false);
                  }}
                  as={Link}
                  to="/user"
                  className={styles.slidingNavLink}
                >
                  Sign Out
                </Nav.Link>
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavBar;
