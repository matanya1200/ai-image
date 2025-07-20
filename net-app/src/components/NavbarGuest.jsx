import { Link } from "react-router-dom";

function NavbarGuest() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-camera-fill me-2"></i>
          גלריית תמונות
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">
              <i className="bi bi-house-fill me-1"></i>
              בית
            </Link>
            <Link className="nav-link" to="/albums">
              <i className="bi bi-folder-fill me-1"></i>
              אלבומים
            </Link>
            <Link className="nav-link" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i>
              התחברות
            </Link>
            <Link className="nav-link" to="/register">
              <i className="bi bi-person-plus-fill me-1"></i>
              הרשמה
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarGuest;