import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../user/UserSlice";
import styles from "./Navbar.module.css";
import logo from "./powderFinderLogo.png";

const NavBar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userName } = useSelector((state) => state.user);
  const location = useLocation();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  useEffect(() => {
    setShowLoginDropdown(location.pathname === "/user/login");
  }, [location.pathname]);

  return (
    <Navbar variant="dark" expand="md" fixed="top" className={styles.navbar}>
      <Container className={styles.navContainer}>
        <Navbar.Brand as={Link} to="/">
          <img className={styles.logo} src={logo} alt="PF" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className={styles.navItems}>
          <Nav>
            <Nav.Item>
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/user/signup">
                  Sign Up
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/user/login">
                  Sign In
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/user/edit">
                  User Settings
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link
                  onClick={() => dispatch(signOut())}
                  as={Link}
                  to="/user"
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
