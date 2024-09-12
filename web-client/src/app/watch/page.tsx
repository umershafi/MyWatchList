import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from "@/src/firebase/functions";
import Style from "./page.module.css";

export default async function Watch() {
  const videos = await getVideos();
  
  return (
    <div>
      <h1>Watch Page</h1>
      {
        videos.map((video) => (
          <Link href={`/watch/video?v=${video.filename}`} key={video.id}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={Style.thumbnail}/>
            <h1> video title:  {video.title} </h1>
          </Link>
        ))
      }
          </div>
  );
}

export const revalidate = 30;