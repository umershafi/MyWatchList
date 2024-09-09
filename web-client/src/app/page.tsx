'use client';

import {useEffect, useState} from "react";
import Styles from "./page.module.css"
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import React from "react";

export interface Genre {
  id: string;
  name: string;
}

export interface Production {
  id: string;
  logo_path: string;
  name: string;
}

export interface Movie {
  poster_path: string;
  id: number;
  title: string;
  backdrop_path: string;
  release_date: string;
  vote_average: string;
  overview: string;
  tagline: string;
  runtime: string;
  vote_count: string;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: Production[];
}

const API_KEY = "api_key=4fad9030c3fc25fe2ed6bc2dae8af483";
const BASE_URL = "https://api.themoviedb.org/3"

const API_URL = BASE_URL + "/movie/popular?" + API_KEY;

export default function Home() {

  const [movies, setMovies] = useState<Movie[]>([]);

  const getMovies = async() => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setMovies(json.results);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <section>
        <div className={Styles.poster}>
            <Carousel
                showThumbs={false}
                autoPlay={true}
                transitionTime={3}
                infiniteLoop={true}
                showStatus={false}
            >
                {movies.map((data) => (
                    <div key={data.id} className={Styles.posterImage}>
                        <Link style={{ textDecoration: "none", color: "white" }} href={`/films/${data.id}`}>
                            <img src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`} alt={data.title} />
                            <div className={Styles.posterImage__overlay}>
                                <div className={Styles.posterImage__title}>{data.title}</div>
                                <div className={Styles.posterImage__runtime}>
                                    {data.release_date}
                                    <span className={Styles.posterImage__rating}>
                                        {data.vote_average}
                                        <i className="fas fa-star" />{" "}
                                    </span>
                                </div>
                                <div className={Styles.posterImage__description}>{data.overview}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </div>
    </section>
);
}


