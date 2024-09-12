// 1. GCS file interactions
// 2. Local file interactions
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage(); // create an instance
const rawVideoBucketName = "umer-raw-videos"; // people will upload videos to this
const processedVideoBucketName = "umer-processed-videos";// upload processed videos here

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export async function getMetadata(fileName: string) {
    const [metadata] = await storage.bucket(rawVideoBucketName).file(fileName).getMetadata();
    console.log(`Bucket: ${metadata.bucket}`);

    if (metadata.metadata) {
        console.log('\n\n\nUser metadata:');

        for (const key in metadata.metadata) {
          console.log(`${key}=${metadata.metadata[key]}`);
          const value = metadata.metadata[key];
          if (typeof value === 'string') {
            return value;
          }
          else {
            console.log("Metadata value is not a string");
            return null;
          }
        }
        
      } else {
        console.log("No video metadata found");
        return null;
      }
}

// Creates the local directories for raw and processes videos
export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedVideoPath);
}

/** 
* @param rawVideoName -- The name of the file to convert from {@link localRawVideoPath}.
* @param ProcessedVideoName -- The name of the file to convert to {@link localProcessedVideoPath}.
* @returns A promise that resolves when the video has been converted.
*/
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`) // pass in the path of the video file you want to process
            // chain the events
            .outputOptions("-vf", "scale=0:360") // video file, scale it into 360p
            .on("end", function () { // event listener for end event
                console.log("Processing Finished Successfully.");
                resolve();
            })
            .on("error", (err, stdout, stderr) => { // event listener for error event
                console.log(`an error occured: ${err.message}`);
                console.log("stdout:\n" + stdout);
                console.log("stderr:\n" + stderr);
                reject(err); 
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`); // path where processed video is saved
        });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` });

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

/**
 * @param fileName - the name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}/
 * @returns A promise that resolves when the file has been uploaded.
 */

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });

    console.log(`${processedVideoBucketName}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);

    await bucket.file(fileName).makePublic(); // set the file to be public (will be private by default)
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localProcessedVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}, err`);
                    reject(err);
                }
                else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        }
        else {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            resolve();
        }
    });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */

function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}