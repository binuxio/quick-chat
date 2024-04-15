import fs from "fs"
import { tempDir } from "./dotenv";
import { io } from ".";

export function extractFilename(fileID: string, separator: string) {
    const regex = new RegExp(`^\\d+${separator}(.+)$`);
    const match = fileID.match(regex);
    return match ? match[1] : null;
}

export function generateUserID() {
    const randomFraction = Math.random();
    const randomNumber = Math.floor(randomFraction * (9999 - 1000 + 1)) + 1000;
    return randomNumber;
}

function checkUniqueness() {

}

export function logger(message: string) {
    console.log(new Date(), message)
}

export function cleanUpTempFolder() {
    if (!fs.existsSync(tempDir)) return
    fs.rm(tempDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error deleting folder:', err);
            return;
        }
        console.log('Folder deleted successfully');
    });
}

export async function emit_event_in_room(socketID: string, event: string, data: any) {
    if (io) {
        try {
            const response = (await io.in(socketID).timeout(3000).emitWithAck(event, data))[0];
            if (response)
                return response.success;
        } catch (error) {
            console.error("Error emitting event:", error);
            return false;
        }
    }
    else {
        console.error("io is not defined")
        return false
    }
}
