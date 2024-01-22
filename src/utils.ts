import path from "path";
import fs from "fs";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import {promisify} from "util";

// @ts-ignore
ffmpeg.setFfmpegPath(ffmpegStatic);

export async function downloadVideo(url: string): Promise<string> {
    const response = await axios.get(url, {responseType: "stream"});
    const videoName = `${uuidv4()}.mp4`;
    const filePath = path.join(
        "./src/convertedVideos",
        videoName
    );
    const writer = fs.createWriteStream(`${filePath}`); // Save the video as 'video.mp4'
    await response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            return resolve(`${filePath}`);
        });
        writer.on("error", reject);
    });
}

export async function sanitizeVideo(fileName: string): Promise<string> {
    const videoName = `${uuidv4()}.mp4`;
    const filePath = path.join(
        "./src/convertedVideos",
        videoName
    );
    return new Promise((resolve, reject) => {
        ffmpeg().input(fileName).outputOptions('-c:v libx264 -crf 23 -preset medium').save(filePath).on('end', () => {
            return resolve(videoName)
        }).on('error', (error) => {
            return reject(error);
        })
    });
}
