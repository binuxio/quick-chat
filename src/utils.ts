import { FileData } from "./types.ts"

export function getFileID(file: FileData) {
    return ((file.lastModified || 0) + file.size + "-" + file.name).toString()
}

export function convertBytes(bytes: number, showUnit = true, unit = "") {
    const sizeInBytes = parseInt(bytes.toString())
    const sizeInKb = (sizeInBytes / 1024).toFixed(2)
    const sizeInMb = (sizeInBytes / 1024 / 1024).toFixed(2)
    unit = unit.toLowerCase()

    if (unit == "kb")
        return sizeInKb + (showUnit ? " KB" : "")
    if (unit == "mb")
        return sizeInMb + (showUnit ? " MB" : "")
    if (sizeInBytes / 1024 >= 1000)
        return sizeInMb + (showUnit ? " MB" : "")
    return sizeInKb + (showUnit ? " KB" : "")
}

export function getFileNumber(file: FileData) {
    return file.size + (file.lastModified || 0)
}