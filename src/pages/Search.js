import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../config/Config.js";
import '../styles/Search.css'

// Initialize Firebase app
initializeApp(firebaseConfig);

export function Search() {
    const [movies, setMovies] = useState([]);
    const [searchType, setSearchType] = useState("title");
    const [searchValue, setSearchValue] = useState("");
  
    const handleSearchTypeChange = (event) => {
      setSearchType(event.target.value);
    };
  
    const handleSearchValueChange = (event) => {
      setSearchValue(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      fetchMovies();
    };
  
    const fetchMovies = async () => {
      const db = getFirestore();
      const moviesCollection = collection(db, "movies");
      let q;
  
      switch (searchType) {
        case "title":
          q = query(moviesCollection, where("title", "==", searchValue));
          break;
        case "year":
          q = query(moviesCollection, where("year", "==", parseInt(searchValue)));
          break;
        case "director":
          q = query(moviesCollection, where("director", "==", searchValue));
          break;
        case "time":
          q = query(moviesCollection, where("time", "==", searchValue));
          break;
        default:
          q = moviesCollection;
      }
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setMovies(data);
    };
  
    useEffect(() => {
      fetchMovies();
    }, []);
  
    return (
      <div className="wrapper">
        <h2>Search movies</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <input
                type="radio"
                value="title"
                checked={searchType === "title"}
                onChange={handleSearchTypeChange}
              />
              Search by title
            </label>
          </div>
          <div>
            <label className="label">
              <input
                type="radio"
                value="year"
                checked={searchType === "year"}
                onChange={handleSearchTypeChange}
              />
              Search by year
            </label>
          </div>
          <div>
            <label className="label">
              <input
                type="radio"
                value="director"
                checked={searchType === "director"}
                onChange={handleSearchTypeChange}
              />
              Search by director
            </label>
          </div>
          <div>
            <label className="label" >
              <input
                type="radio"
                value="genre"
                checked={searchType === "genre"}
                onChange={handleSearchTypeChange}
              />
              Search by genre
            </label>
          </div>
          <div>
            <input className="input"
              type="text"
              value={searchValue}
              onChange={handleSearchValueChange}
              placeholder={`Enter ${searchType}...`}
            />
          </div>
            <div>
                <button className="button" type="submit">Search</button>
            </div>
        </form>
        {/* Render movie data */}
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <p>Year: {movie.year}</p>
            <p>Genre: {movie.genre}</p>
            <p>Director: {movie.director}</p>
            
          </div>
        ))}
      </div>
    );
  }
