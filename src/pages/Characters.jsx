import { useState, useEffect } from "react";
import "./Characters.css";
import { useNavigate } from "react-router-dom";

function Characters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Vous devez être connecté pour voir les personnages.");
          setLoading(false);
          return;
        }

        const skip = (page - 1) * 100;
        let url = `http://localhost:5000/api/characters?limit=100&page=${page}&skip=${skip}`;
        if (searchName) {
          url += `&name=${encodeURIComponent(searchName)}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setCharacters(data.results);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des personnages.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [page, searchName]);

  const handleClickOnCard = (characterId) => {
    navigate(`/character/${characterId}`);
  };

  return (
    <div className="characters-page">
      <h1>Personnages Marvel</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Recherchez un personnage..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="characters-grid">
            {characters.map((character) => (
              <div
                className="character-card"
                key={character._id}
                onClick={() => handleClickOnCard(character._id)}
              >
                <img
                  src={`${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`}
                  alt={character.name}
                />
                <h2>{character.name}</h2>
                <p>{character.description || ""}</p>
              </div>
            ))}
          </div>
          <div className="pagination">
            {page > 1 && (
              <button onClick={() => setPage((prevPage) => prevPage - 1)}>
                Précédent
              </button>
            )}
            <span>Page {page}</span>
            {characters.length === 100 && (
              <button onClick={() => setPage((prevPage) => prevPage + 1)}>
                Suivant
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Characters;
