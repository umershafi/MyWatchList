import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const setVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function uploadVideo(file: File, videoTitle: string) {
  const response: any = await generateUploadUrlFunction({ // returns a url and a filename
    fileExtension: file.name.split('.').pop(),
    vidTitle: videoTitle
  });

  const fileName = response?.data?.fileName;
  // console.log(fileName);
  // console.log("url: ", response.data.url);

  // Upload the file via the signed URL
  const uploadResult = await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
      'x-goog-meta-title': videoTitle
    },
  });

  // console.log("upload result status: ", uploadResult.status);
  // console.log(response.data.filename);

  // if (uploadResult.status === 200) {
  //   const videoData: Video = {
  //     status: "processing",
  //     title: vidTitle
  //   };

  //   await setVideosFunction({
  //     videoId: fileName,
  //     title: vidTitle
  //   });

    // console.log("title: ", videoTitle);
    // console.log("")
  //}

  return uploadResult;
}

export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[];
}
