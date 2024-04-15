export function extractFilename(fileID: string, separator: string) {
    const regex = new RegExp(`^\\d+${separator}(.+)$`);
    const match = fileID.match(regex);
    return match ? match[1] : null;
}

export interface FileInterface {
    size: number
    lastModified: number
    name: string
    type: string
}

export function getFileID(file: FileInterface) {
    return (file.lastModified + file.size + "-" + file.name).toString()
}

export function generateUserID() {
    const randomFraction = Math.random();

    // Scale the random number to be between 1000 and 9999
    const randomNumber = Math.floor(randomFraction * (9999 - 1000 + 1)) + 1000;

    return randomNumber;
}

function checkUniqueness() {

}


export function logger(message: string) {
    console.log(new Date(), message)
}