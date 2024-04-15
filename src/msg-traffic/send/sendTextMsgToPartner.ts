import fs from "fs"
import path from "path"
import { Socket } from "socket.io";
import { TextMessage, _Submit } from "../../types";
import { tempDir } from "../../dotenv";

export default function (submitObject: _Submit, receiversSocketIDs: string[], socket: Socket) {
    const senderID = submitObject.fromUser.id

    console.log("sending Text Message to Partner. ID:", submitObject.toPartner.id)

    const readPath = path.join(tempDir, senderID.toString(), submitObject.textMsgID)

    fs.readFile(readPath, (err, data) => {
        if (err) {
            // TODO: Error handling on client if his messages could not be delivered
            console.log(err)
            return
        }

        const textMsgObject: TextMessage = {
            type: "text",
            time: submitObject.time,
            fromUser: submitObject.fromUser,
            toPartner: submitObject.toPartner,
            message: data.toString()
        }

        receiversSocketIDs.forEach(sid => {
            socket.to(sid).emit("new-textMsg", textMsgObject)
        })

        fs.rm(readPath, (err) => {
            if (err) {
                console.log(err)
                return
            }
        })
    })

}