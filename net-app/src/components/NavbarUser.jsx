import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NavbarUser({ role, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
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
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/">
              <i className="bi bi-house-fill me-1"></i>
              בית
            </Link>
            <Link className="nav-link" to="/my-images">
              <i className="bi bi-images me-1"></i>
              התמונות שלי
            </Link>
            <Link className="nav-link" to="/add-image">
              <i className="bi bi-plus-circle-fill me-1"></i>
              הוספת תמונה
            </Link>
            <Link className="nav-link" to="/profile">
              <i className="bi bi-person-circle me-1"></i>
              הפרופיל שלי
            </Link>
            
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-folder-fill me-1"></i>
                אלבומים
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/albums">כל האלבומים</Link></li>
                <li><Link className="dropdown-item" to="/my-albums">האלבומים שלי</Link></li>
                <li><hr className="dropdown-divider"/></li>
                <li><Link className="dropdown-item" to="/albums/new">
                  <i className="bi bi-plus-circle me-1"></i>
                  צור אלבום
                </Link></li>
              </ul>
            </div>

            {role === "admin" && (
              <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-warning" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-shield-fill me-1"></i>
                  ניהול
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/admin/users">
                    <i className="bi bi-people-fill me-1"></i>
                    ניהול משתמשים
                  </Link></li>
                  <li><Link className="dropdown-item" to="/admin/comments">
                    <i className="bi bi-chat-dots-fill me-1"></i>
                    ניהול תגובות
                  </Link></li>
                  <li><Link className="dropdown-item" to="/admin/blocked-images">
                    <i className="bi bi-chat-dots-fill me-1"></i>
                    ניהול תמונות חסומות
                  </Link></li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="navbar-nav">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              התנתק
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarUser;