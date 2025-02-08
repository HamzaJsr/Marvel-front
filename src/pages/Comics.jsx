import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Comics.css";

function Comics() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Vous devez être connecté pour voir les comics.");
          setLoading(false);
          return;
        }

        const skip = (page - 1) * 100;
        let url = `http://localhost:5000/api/comics?page=${page}&limit=100&skip=${skip}`;
        if (searchTitle) {
          url += `&title=${encodeURIComponent(searchTitle)}`;
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

        const sortedComics = data.results.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setComics(sortedComics);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des comics.");
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, [page, searchTitle]);

  const handleClickOnComic = (comicId) => {
    navigate(`/comic/${comicId}`);
  };

  return (
    <div className="comics-page">
      <h1>Comics Marvel</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Recherchez un comic..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="comics-grid">
            {comics.map((comic) => (
              <div
                key={comic._id}
                className="comic-card"
                onClick={() => handleClickOnComic(comic._id)}
              >
                <img
                  src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
                  alt={comic.title}
                />
                <h2>{comic.title}</h2>
                <p>{comic.description || "Aucune description."}</p>
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
            {comics.length === 100 && (
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

export default Comics;
