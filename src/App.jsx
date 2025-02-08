import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Characters from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import Comics from "./pages/Comics";
import ComicDetail from "./pages/ComicDetail";
import Favoris from "./pages/Favoris";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);

        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            navigate("/login");
          }
        } catch (err) {
          console.error(err);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className="app">
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          user={user}
        />
        <main className="main-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUser={setUser}
                />
              }
            />
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Characters />} />
                <Route
                  path="/character/:characterId"
                  element={<CharacterDetail />}
                />
                <Route path="/comics" element={<Comics />} />
                <Route path="/comic/:comicId" element={<ComicDetail />} />
                <Route path="/favoris" element={<Favoris />} />
              </>
            ) : (
              <Route path="*" element={<p>Vous devez être connecté.</p>} />
            )}
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
