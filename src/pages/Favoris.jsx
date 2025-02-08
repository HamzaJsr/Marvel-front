import { useEffect, useState } from "react";
import "../styles/Favoris.css";

function Favoris() {
  const [favorites, setFavorites] = useState({ characters: [], comics: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour voir vos favoris.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setFavorites(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des favoris.", err);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h1>Vos Favoris ❤️</h1>

      {error && <p className="error">{error}</p>}

      <h2>Personnages</h2>
      <div className="favorites-grid">
        {favorites.characters.length === 0 ? (
          <p>Aucun personnage favori.</p>
        ) : (
          favorites.characters.map((id) => (
            <div key={id} className="favorite-card">
              <p>Personnage ID: {id}</p>
            </div>
          ))
        )}
      </div>

      <h2>Comics</h2>
      <div className="favorites-grid">
        {favorites.comics.length === 0 ? (
          <p>Aucun comic favori.</p>
        ) : (
          favorites.comics.map((id) => (
            <div key={id} className="favorite-card">
              <p>Comic ID: {id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favoris;
