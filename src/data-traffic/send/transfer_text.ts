import { checkSocket } from "../_socket.ts";
import { Socket } from "socket.io-client";
import { fileTransferInProgress } from "./transfer_file.ts";
import submitMsg from "./submitMsg.ts";
import { _Submit } from "@/types.ts";

export default async function (text: string, submitObject: _Submit) {
    try {
        const { socket } = await checkSocket()
        uploadTextFile(socket, text, submitObject)
    } catch (err) {
        console.log(err)
    }
}

const chunkSize = window.chunkSize

async function uploadTextFile(socket: Socket, text: string, submitObject: _Submit) {
    console.log("uploading text")
    const blob = new Blob([text], { type: "text/plain" })
    console.log("submitObject", submitObject)
    const res = await socket.emitWithAck("request-transfer", { filename: submitObject.textMsgRef })

    if (res.status == 200) {
        fileTransferInProgress.set(submitObject.textMsgRef, { interrupted: false })
        sendChunks(socket, blob, res.bytesLoaded, submitObject)
    } else if (res.status == 400) { // bad request
        // file too large section
        // currently not programmed on server
        //TODO: Create a dialog for system messages and set the appropriate style for the filebox
        console.log(res.msg)
    }
    else {
        console.log("Error preparing filetransfer")

    }
}

async function sendChunks(socket: Socket, blob: Blob, bytesLoaded: number, submitObject: _Submit) {
    console.log("start sending textmsg chunks")
    const filesize = blob.size

    console.log(submitObject)

    let startByte = bytesLoaded
    while (startByte < filesize) {
        console.log(startByte, filesize)
        const endByte = startByte + chunkSize;
        const chunk = blob.slice(startByte, endByte, blob.type);
        console.log({ chunk: chunk, chunksize: chunk.size, filename: submitObject.textMsgRef })
        const res = await socket.emitWithAck('file-transfer', { chunk: chunk, chunksize: chunk.size, filename: submitObject.textMsgRef });

        if (res.status !== 200) {
            console.log("Error while transfer chunks");
            return
        }
        bytesLoaded += chunk.size
        startByte = endByte;
    }
    fileTransferInProgress.delete(submitObject.textMsgRef)
    socket.emit("transfer-completed", { filename: submitObject.textMsgRef })
    console.log("Transfer completed")
    submitMsg(submitObject)
}