import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setError(null);
    setMovieList([]);
    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        setMovieList([]);
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (err) {
      setError(`Error fetching movies... ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
    return () => {};
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
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
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className={"trending"}>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster} alt={movie.name} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={"all-movies"}>
          <h2 className={"mt-10 mb-5"}>All Movies</h2>
          {isLoading ? (
            <h3 className={"text-red-500"}>Loading ... </h3>
          ) : error ? (
            <h3 className={"text-red-500"}>{error}</h3>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
