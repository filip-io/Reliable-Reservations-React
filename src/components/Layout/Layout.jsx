import React from 'react';
import { Outlet } from "react-router-dom";
import { Navbar, Container } from 'react-bootstrap';

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="light" className="border-bottom">
        <Container fluid className="justify-content-center">
          <Navbar.Brand className="m-0">Magnificent Restaurant</Navbar.Brand>
        </Container>
      </Navbar>

      <main className="flex-grow-1 d-flex justify-content-center align-items-start mt-4 px-3">
        <Outlet />
      </main>

      <footer className="bg-light text-muted py-3 border-top text-center w-100">
        <Container fluid>
          &copy; {new Date().getFullYear()} Magnificent Restaurant. All rights reserved.
        </Container>
      </footer>
    </div>
  );
}

export default Layout;