'use client';

import { useEffect, useState } from "react";
import { Production, Genre, Movie } from "../../page";
import Style from "./page.module.css";
import React from "react";
import { User } from "firebase/auth";
import { onAuthStateChangedHelper } from "@/src/firebase/firebase";


export default function FilmDetails( { 
  params, 
} : {
  params: { filmId: string };
}) {

  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {
    getData()
    window.scrollTo(0,0)
  }, [])

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [] /* No dependencies, never rerun */);

  const getData = () => {
    fetch(`https://api.themoviedb.org/3/movie/${params.filmId}?api_key=4fad9030c3fc25fe2ed6bc2dae8af483`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then((data: Movie) => setMovie(data))
    .catch(error => console.error('There was a problem with the fetch operation:', error));
};

return (
  <div className={Style.movie}>
      <div className={Style.movie__intro}>
          <img className={Style.movie__backdrop} src={`https://image.tmdb.org/t/p/original${movie ? movie.backdrop_path : ""}`} />
      </div>
      <div className={Style.movie__detail}>
          <div className={Style.movie__detailLeft}>
              <div className={Style.movie__posterBox}>
                  <img className={Style.movie__poster} src={`https://image.tmdb.org/t/p/original${movie ? movie.poster_path : ""}`} />
              </div>
          </div>
          <div className={Style.movie__detailRight}>
              <div className={Style.movie__detailRightTop}>
                  <div className={Style.movie__name}>{movie ? movie.title : ""}</div>
                  <div className={Style.movie__tagline}>{movie ? movie.tagline : ""}</div>
                  <div className={Style.movie__rating}>
                      {movie ? movie.vote_average: ""} <i />
                      <span className={Style.movie__voteCount}>{movie ? "(" + movie.vote_count + ") votes" : ""}</span>
                  </div>  
                  <div className={Style.movie__runtime}>{movie ? movie.runtime + " mins" : ""}</div>
                  <div className={Style.movie__releaseDate}>{movie ? "Release date: " + movie.release_date : ""}</div>
                  <div className={Style.movie__genres}>
                      {
                          movie && movie.genres
                          ? 
                          movie.genres.map(genre => (
                              <><span className={Style.movie__genre} id={genre.id}>{genre.name}</span></>
                          )) 
                          : 
                          ""
                      }
                  </div>
              </div>
              <div className={Style.movie__detailRightBottom}>
                  <div className={Style.synopsisText}>Synopsis</div>
                  <div>{movie ? movie.overview : ""}</div>
              </div>
                <div>
                    {
                        (user && "comments") || "sign in to leave a review"
                    }
                </div>
          </div>
      </div>
      
      <div className={Style.movie__links}>
          <div className={Style.movie__heading}>Useful Links</div>
          {
              movie && movie.homepage && <a href={movie.homepage} target="_blank" style={{textDecoration: "none"}}><p><span className={`${Style.movie__homeButton} ${Style.movie__Button}`}>Homepage <i className={`${Style.newTab} fas fa-external-link-alt`}></i></span></p></a>
          }
          {
              movie && movie.imdb_id && <a href={"https://www.imdb.com/title/" + movie.imdb_id} target="_blank" style={{textDecoration: "none"}}><p><span className={`${Style.movie__imdbButton} ${Style.movie__Button}`}>IMDb<i className={`${Style.newTab} fas fa-external-link-alt`}></i></span></p></a>
          }
      </div>
      <div className={Style.movie__heading}>Production companies</div>
      <div className={Style.movie__production}>
          {
              movie && movie.production_companies && movie.production_companies.map(company => (
                  <React.Fragment key={company.id}>
                      {
                          company.logo_path 
                          && 
                          <span className={Style.productionCompanyImage}>
                              <img className={Style.movie__productionComapany} src={"https://image.tmdb.org/t/p/original" + company.logo_path} />
                              <span style={{color:"white"}}>{company.name}</span>
                          </span>
                      }
                  </React.Fragment>
              ))
          }
      </div>
  </div>
)
}