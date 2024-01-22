import express from 'express';
import * as bodyParser from 'body-parser';
import {downloadVideo, sanitizeVideo} from "./utils";
export const initializeServer = () => {
    const app = express();
    app.use(bodyParser.json());
    // set timeout to 5 minutes
    app.use(bodyParser.urlencoded({ extended: true, limit: '5m' }));
    const PORT = process.env.PORT || 7878;
    app.post('/api/v1/sanitizeVideo', (req, res) => {
        const body = req.body;
        if(!body.url) return res.status(400).json({ message: 'url is required' });
        console.log(`[${new Date().toLocaleTimeString()}][INFO] Requesting Video Sanitization`);
        downloadVideo(body.url).then((fileName) => {
            console.log(`[${new Date().toLocaleTimeString()}][INFO] Video downloaded`);
            sanitizeVideo(fileName).then((video) => {
                console.log(`[${new Date().toLocaleTimeString()}][INFO] Video sanitized`);
                res.status(200).json({ message: 'success', content: video });
            }).catch((error) => {
                console.log(`[${new Date().toLocaleTimeString()}][ERROR] ${error}`);
                res.status(500).json({ message: error });
            })
        }).catch((error) => {
            console.log(`[${new Date().toLocaleTimeString()}][ERROR] ${error}`);
            res.status(500).json({ message: error });
        })
    })
    app.listen(PORT, () => {
      console.log(`[${new Date().toLocaleTimeString()}][INFO] Listening on port ${PORT}`);
    });
}

initializeServer();
