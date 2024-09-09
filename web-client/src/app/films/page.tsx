'use client';

import {useEffect, useState} from "react";
import Styles from "./page.module.css"
import Link from "next/link";

interface Movie {
  poster_path: string;
  id: number;
  title: string;
}

const API_KEY = "api_key=4fad9030c3fc25fe2ed6bc2dae8af483";
const BASE_URL = "https://api.themoviedb.org/3"

const API_URL = BASE_URL + `/discover/movie?` + API_KEY;

export default function Film() {

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
    getMovies();
  }, [])

  return (
    <section>
      <div>
        <h1 className={Styles.h1}> Popular Now (Films) </h1>
        {movies.map((data) => {
          return <>
            <Link href={`/films/${data.id}`}>
              <img className={Styles.img}src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} key={data.id} />
            </Link>
          </>
        })}
      </div>
    </section>
  )
}


