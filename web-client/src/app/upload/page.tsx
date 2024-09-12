'use client';

import { Fragment, useState } from "react";
import { uploadVideo } from "../../firebase/functions";

import styles from "./page.module.css";

export default function Upload() {

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!title) {
      alert("please provide a video title");
      return;
    }

    if(!file) {
      alert("please provide a file");
      return;
    }

    try {
      const response = await uploadVideo(file, title);
      alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <Fragment>
      <div className={styles.uploadForm}>
        <input
          type="text"
          placeholder="Enter a video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
        />
      
        <input 
          id="upload" 
          className={styles.uploadInput} 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange} 
        />

      <label htmlFor="upload" className={styles.uploadButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          strokeWidth={1.2} 
          stroke="currentColor" 
          className="w-6 h-6">
            <path 
              strokeLinecap="round" 
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" 
            />
        </svg>
      </label>

        <button className={styles.submitButton} onClick={handleUpload}>
          Upload Video
        </button>
      </div>
    </Fragment>
  );
}