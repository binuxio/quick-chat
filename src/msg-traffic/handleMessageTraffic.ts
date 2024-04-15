import { Socket } from "socket.io";
import { FileMessage, TextMessage, _Submit } from "../types";
import sendTextMsgToPartner from "./sendToPartner/send";
import { usersMap } from "../users/usersDB";
import { UserObject } from "../users/user.types";
import sendToPartner from "./sendToPartner";

type MessageQueue = TextMessage | FileMessage
export const messageQueueMap = new Map<number, MessageQueue[]>()

export default function (submitObject: _Submit) {
    const socket: Socket = this
    if (!socket) throw new Error("Socket is undefined")
    const receiverID = submitObject.toPartner.id
    const user = usersMap.get(receiverID)

    if (user) {
        addToMessageQueue(submitObject, receiverID)
        sendToPartner(receiverID)
    } else {
        // Actually rare case. Because User can send msgs ony after the partner ID has been validated
        console.log("Receiver not found")
        socket.emit("err-invalid-userID")
    }
}

function addToMessageQueue(submitObject: _Submit, receiverID: number) {
    const receiversQueue = messageQueueMap.get(receiverID)
    const { files, fromUser, toPartner, textMsgRef, time } = submitObject

    console.log(files)

    const messages: MessageQueue[] = files.map(file => {
        return {
            type: "file",
            fromUser,
            toPartner,
            fileRef: file.fileRef,
            file,
            time,
            _id: new Date().getTime().toString()
        }
    })

    const textMsg: TextMessage = {
        type: "text",
        fromUser,
        toPartner,
        textMsgRef,
        time,
        _id: new Date().getTime().toString()
    }

    messages.push(textMsg)

    if (receiversQueue) {
        const queue = receiversQueue.concat(messages);
        messageQueueMap.set(receiverID, queue);
    } else {
        messageQueueMap.set(receiverID, messages)
    }
}

export function checkMessagesInQueue(receiverID: number) {
    const receiversQueue = messageQueueMap.get(receiverID)

    if (receiversQueue && receiversQueue.length > 0) {
        sendToPartner(receiverID)
    }
}