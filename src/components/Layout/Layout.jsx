import React from 'react';
import { Outlet } from "react-router-dom";
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '/images/logo.png'
import './Layout.css'

function Layout() {
  return (
    <>
      <div className="page-container">
        <div className="d-flex flex-column min-vh-100 min-vw-100">
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

          <main className="flex-grow-1 d-flex justify-content-center align-items-start px-3">
            <Outlet />
          </main>

          <footer className="text-muted py-3 text-center w-100">
            <Container fluid>
              &copy; {new Date().getFullYear()} Magnificent Restaurant. All rights reserved.
            </Container>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Layout;