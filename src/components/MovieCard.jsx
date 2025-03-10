import React from "react";

const MovieCard = ({ movie }) => {
  const { title, poster_path } = movie;
  return (
    <div className={"movie-card"}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "no-movie.png"
        }
        alt={title}
      />
      <h4 className={"text-white"}>{title}</h4>
    </div>
  );
};

export default MovieCard;
