import express from "express";
import { downloadRawVideo, setupDirectories, uploadProcessedVideo, convertVideo, deleteRawVideo, deleteProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    // Get the bucket and filename from the Cloud Pub/Sub message

    let data;

    try {
        const message = Buffer.from(req.body.message?.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received.')
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.')
    }

    const inputFileName = data.name; // Format of <UID>-<DATE>.<EXTENSION>
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send('Bad Request: video already processing or processed.');
      } else {
        await setVideo(videoId, {
          id: videoId,
          uid: videoId.split('-')[0],
          status: 'processing'
        });
      }

    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Convert the video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err){
        await Promise.all ([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        
        console.log(err);
        return res.status(500).send('Internal Server Error: video processing failed.');
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: 'processed',
        filename: outputFileName
      });

    // this could be repetitive, maybe add final block to make it cleaner
    await Promise.all ([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('OK');
});

const port = process.env.PORT || 3000; // standard way of providing port at runtime (important for when we deploy)
app.listen(port, () => {
    console.log(`video processing service listening at http://localhost:${port}`);
});

