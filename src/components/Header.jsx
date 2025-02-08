import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/marvel-logo.png" alt="Marvel Logo" />
      </div>
      <nav className="menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Personnages
        </NavLink>
        <NavLink
          to="/comics"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Comics
        </NavLink>
        <NavLink
          to="/favoris"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Favoris
        </NavLink>
      </nav>
      <div className="auth-section">
        {isAuthenticated ? (
          <>
            <span style={{ color: "white" }}>Bienvenue, {userName}!</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink to="/login" className="login-button">
            Se connecter
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Header;
