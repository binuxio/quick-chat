import path from "path"
import fs from "fs"
import { tempDir } from "../../dotenv"

export const lastChunkReceived = new Map<string, { bytesLoaded: number }>()

export default function (transferDetails: any, callback: ({ }) => void) {
    try {
        const userID = this.request.session.user.userID.toString()
        const { filename, chunk, chunksize } = transferDetails
        const writePath = path.join(tempDir, userID, filename)
        const writestream = fs.createWriteStream(writePath, { flags: "a", })
        console.log("upload", filename)

        writestream.on("finish", () => {
            callback({ status: 200 })
            const fileProgressID = userID + "-" + filename
            const lastChunk = lastChunkReceived.get(fileProgressID)
            const bytesLoaded = (lastChunk ? lastChunk.bytesLoaded : 0) + chunksize
            lastChunkReceived.set(fileProgressID, { bytesLoaded: bytesLoaded })
        })

        writestream.on('error', (err) => {
            callback({ status: 500 })
            console.error('Error writing file:', err);
        });

        writestream.write(chunk)
        writestream.end()
    } catch (error) {
        console.log(error)
    }
}

