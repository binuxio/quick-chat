import fs from "fs"
import path from "path"
import { FileMessage, TextMessage, _Submit } from "../../types";
import { tempDir } from "../../dotenv";
import { usersMap } from "../../users/usersDB";
import { emit_event_in_room } from "../../utils";

export default async function (receiverID: number, message: TextMessage | FileMessage,): Promise<boolean> {
    const user = usersMap.get(receiverID)
    if (!user) { console.error("Receiver not found"); return false }
    const receiversSocketIDs = user.currentSocketIDs
    const { fromUser, toPartner, time } = message
    console.log("sending message to Partner. ID:", toPartner.id)


    let msgSentSuccess = false
    try {
        let msgObject: FileMessage | Omit<TextMessage, "_id">
        let readPath: undefined | string = undefined
        if (message.type === "text") {
            readPath = path.join(tempDir, fromUser.id.toString(), message.textMsgRef)
            const text = await fs.promises.readFile(readPath);
            msgObject = {
                type: "text",
                time,
                fromUser,
                toPartner,
                message: text.toString()
            }
        } else if (message.type === "file") {
            msgObject = message
        }
        else {
            throw new Error("Message Type is neither 'Text' nor 'File'")
        }

        await Promise.all(receiversSocketIDs.map(async (sid) => {
            try {
                const success = await emit_event_in_room(sid, "new-msg", msgObject);
                if (success) msgSentSuccess = true;
            } catch (e) {
                throw new Error(e.toString())
            }
        }));

        if (msgSentSuccess && readPath) fs.promises.rm(readPath)
    } catch (err) {
        console.error("Error sending Message:", err);
    }

    return msgSentSuccess;
}
