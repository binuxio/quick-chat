import { checkSocket } from "../_socket.ts";
import { Socket } from "socket.io-client";
import { FileData } from "@/types.ts";
import { convertBytes, getFileID, getFileNumber } from "@/utils.ts";

export default async function transfer_file(file: FileData) {
    try {
        const { socket } = await checkSocket()
        uploadFile(socket, file)
    } catch (err) {
        console.log(err)
    }
}
const chunkSize = window.chunkSize

export const fileTransferInProgress = new Map<string, { interrupted: boolean, file?: FileData }>()

async function uploadFile(socket: Socket, file: FileData) {
    const fileID = getFileID(file)
    const stylesheetID = ("stylesheet-" + fileID).replace(/ /g, "")
    createStyleSheet(stylesheetID)
    const filename = file.name
    const res = await socket.emitWithAck("request-transfer", { filename: filename, /* filesize */ })

    if (res.status == 200) {
        if (res.transferCompleted) {
            const styleElement = document.getElementById(stylesheetID)
            const unit = file.size / 1024 >= 1000 ? "mb" : "kb"
            const bytesTotalString = convertBytes(file.size, true, unit)
            let fileNumber = file.size + getFileNumber(file)
            setStylesForFileProgress(styleElement, file.size, file.size, bytesTotalString, unit, fileNumber)
            console.log("File transfer was completed")
            return
        } else {
            fileTransferInProgress.set(fileID, { interrupted: false, file: file })
            sendChunks(socket, file, res.bytesLoaded)
        }
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

async function sendChunks(socket: Socket, file: FileData, bytesLoaded: number) {
    console.log("start sending chunks")
    const fileID = getFileID(file)
    const filename = file.name
    const stylesheetID = ("stylesheet-" + fileID).replace(/ /g, "")
    let fileNumber = file.size + getFileNumber(file)
    const styleElement = document.getElementById(stylesheetID)
    const unit = file.size / 1024 >= 1000 ? "mb" : "kb"
    const bytesTotalString = convertBytes(file.size, true, unit)
    const filesize = file.size
    console.log(file.type)
    // @ts-ignore
    const blob = new Blob([file], { type: file.type })

    let startByte = bytesLoaded
    while (startByte < filesize) {
        if (fileTransferInProgress.get(fileID)?.interrupted) {
            console.log("transfer interrupted")
            return
        }
        console.log(startByte, filesize)
        const endByte = startByte + chunkSize;
        const chunk = blob.slice(startByte, endByte, file.type);
        const res = await socket.emitWithAck('file-transfer', { chunk: chunk, chunksize: chunk.size, filename: filename });
        if (res.status !== 200) {
            console.log("Error while transfer chunks");
            return
        }
        bytesLoaded += chunk.size
        startByte = endByte;
        setStylesForFileProgress(styleElement, bytesLoaded, filesize, bytesTotalString, unit, fileNumber)
    }
    fileTransferInProgress.delete(fileID)
    socket.emit("transfer-completed", { filename: filename })
    console.log("Transfer completed")
}

/* css */
function setStylesForFileProgress(styleElement: any, bytesLoaded = 0, bytesTotal = 0, bytesTotalString = "0", unit: string, filenumber: number) {
    const progress = ((bytesLoaded * 100) / bytesTotal).toFixed(2)

    if (styleElement) {
        styleElement.textContent = `
            #fileContainer-${filenumber}{${progress == "100.00" ? "border-color: #0ea5e9 !important" : ""}}
            #progressContainer-${filenumber}{${progress == "100.00" ? "display: none !important" : ""}}
            #progressBar-${filenumber}{width: ${progress}% !important;}
    `}
    const progressBytesElement = document.querySelectorAll("#bytesProgress-" + filenumber)
    if (progressBytesElement) {
        progressBytesElement.forEach(pe => pe.textContent = `${convertBytes(bytesLoaded, false, unit)} / ${bytesTotalString}`)
    }
}

function createStyleSheet(fileID: string) {
    const styleElement = document.createElement("style")
    styleElement.setAttribute("id", fileID)
    document.head.appendChild(styleElement)
}