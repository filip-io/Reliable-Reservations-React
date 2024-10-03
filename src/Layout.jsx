import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top border-bottom">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav align-items-center">
              <li className="nav-item mx-3">
                  <Link className="navbar-brand mx-3" to="/">
                    Magnificent Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reserve">
                    Reserve
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Outlet />
      </main>

      <footer className="bg-light text-muted py-3 border-top text-center mt-auto">
        <div className="container">
          &copy; {new Date().getFullYear()} Magnificent Restaurant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Layout;