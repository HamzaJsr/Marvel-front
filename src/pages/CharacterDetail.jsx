import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CharacterDetail.css";

function CharacterDetail() {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setError(
            "Vous devez être connecté pour voir les details des personnages."
          );
          setLoading(false);
          return;
        }

        const charResponse = await fetch(
          `http://localhost:5000/api/character/${characterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!charResponse.ok) {
          throw new Error(`Erreur HTTP : ${charResponse.status}`);
        }
        const charData = await charResponse.json();
        setCharacter(charData);

        const comicsResponse = await fetch(
          `http://localhost:5000/api/comics/${characterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!comicsResponse.ok) {
          throw new Error(`Erreur HTTP : ${comicsResponse.status}`);
        }
        const comicsData = await comicsResponse.json();
        console.log("Réponse de l'API comics :", comicsData);

        setComics(comicsData.comics);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des données du personnage.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [characterId]);

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "character", id: characterId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Ajouté aux favoris !");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!character) return <p>Aucun personnage trouvé.</p>;

  return (
    <div className="character-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="character-info">
        <img
          className="character-img"
          src={`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`}
          alt={character.name}
        />
        <div className="character-text">
          <h1>{character.name}</h1>
          <p>{character.description || "Aucune description disponible."}</p>

          <button onClick={handleAddFavorite} className="favorite-button">
            Ajouter aux favoris ❤️
          </button>
        </div>
      </div>

      <h2>Comics liés</h2>
      {comics.length === 0 ? (
        <p>Aucun comic trouvé pour ce personnage.</p>
      ) : (
        <div className="comics-grid">
          {comics.map((comic) => (
            <div key={comic._id} className="comic-card">
              <img
                src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
                alt={comic.title}
              />
              <h3>{comic.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterDetail;
