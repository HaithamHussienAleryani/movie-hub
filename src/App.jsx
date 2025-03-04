import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    authorization: "Bearer " + API_KEY,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const endpoint = `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        setMovieList([]);
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setMovieList(data.results || []);
    } catch (err) {
      console.error(`Error fetching movies... ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    return () => {};
  }, []);

  return (
    <main>
      <div className={"pattern"} />
      <div className={"wrapper"}>
        <header>
          <img src={"/hero.png"} alt={"Hero Banner"} />
          <h1>
            Find <span className={"text-gradient"}>Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
        </header>
        <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <div className={"all-movies"}>
          <h2 className={"mt-10 mb-5"}>All Movies</h2>
          {isLoading ? (
            <h3>Loading ... </h3>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
