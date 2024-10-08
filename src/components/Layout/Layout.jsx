import React from 'react';
import { Outlet } from "react-router-dom";
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '/images/logo.png'
import './Layout.css'

function Layout() {
  return (
    <div className="layout-container">
      <Navbar className="border-bottom brand-banner">
        <Container fluid className="justify-content-center">
          <Link to="/" className="lead no-link-styles">
            <span>Magnificent</span>
            <img
              src={logo}
              alt="Logo"
              style={{ width: '30px', height: '30px', margin: '0 10px', marginBottom: '5px' }}
            />
            <span>Restaurant</span>
          </Link>
        </Container>
      </Navbar>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer-brand">
        <Container fluid>
          &copy; {new Date().getFullYear()} Magnificent Restaurant
        </Container>
      </footer>
    </div>
  );
}

export default Layout;