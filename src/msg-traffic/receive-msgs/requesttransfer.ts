import path from "path"
import fs from "fs"
import { lastChunkReceived } from "./chunksreceiver";
import { tempDir } from "../../dotenv";

export default function (transferDetails: any, callback: ({ }) => void) {
    try {
        console.log(transferDetails)
        const userID = this.request.session.user.userID.toString()
        const { filename, filesize } = transferDetails
        const transferSessionDir = path.join(tempDir, userID)
        const writePath = path.join(transferSessionDir, filename)
        const fileProgressID = userID + "-" + filename
        /* 
            TODO: set filesize limit
            if (filesize > maxFileSize) {
            console.log("File too large")
            callback({ status: 400, transferCompleted: false })
            return
        } */
        fs.mkdirSync(transferSessionDir, { recursive: true })
        if (fs.existsSync(writePath)) {
            const lastChunk = lastChunkReceived.get(fileProgressID)

            if (lastChunk == null) {
                console.log("File transfer was completed")
                callback({ status: 200, transferCompleted: true })
            }
            else {
                console.log("Continue")
                callback({ status: 200, transferCompleted: false, bytesLoaded: lastChunk.bytesLoaded, })
            }
        }
        else {
            console.log("New file")
            callback({ status: 200, transferCompleted: false, bytesLoaded: 0 })
        }
    } catch (error) {
        console.log(error)
        callback({ status: 500 })
    }
}