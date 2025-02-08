import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ComicDetail.css";

function ComicDetail() {
  const { comicId } = useParams();
  const navigate = useNavigate();

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComic = async () => {
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

        const response = await fetch(
          `http://localhost:5000/api/comic/${comicId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        setComic(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des informations du comic.");
      } finally {
        setLoading(false);
      }
    };
    fetchComic();
  }, [comicId]);

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
        body: JSON.stringify({ type: "comic", id: comicId }),
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
  if (!comic) return <p>Aucun comic trouvé.</p>;

  return (
    <div className="comic-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <div className="comic-info">
        <img
          className="comic-img"
          src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
          alt={comic.title}
        />
        <div className="comic-text">
          <h1>{comic.title}</h1>
          <p>{comic.description || "Aucune description disponible."}</p>
          <button onClick={handleAddFavorite} className="favorite-button">
            Ajouter aux favoris ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComicDetail;
