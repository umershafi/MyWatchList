'use client';

import { useSearchParams } from 'next/navigation'
import Styles from "./page.module.css";


export default function videoId() {
  const videoPrefix = 'https://storage.googleapis.com/umer-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  return (
    <div className={Styles.container}>
      <h1> Video ID page </h1>
      { <video className={Styles.videoPlayer} controls src={videoPrefix + videoSrc}/> }
    </div>
  )
}