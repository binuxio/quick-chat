import transfer_file, { fileTransferInProgress } from "./transfer_file.ts";

export default function () {
    for (const file of fileTransferInProgress.values()) {
        if (file.file && !file.interrupted) transfer_file(file.file)
    }
}