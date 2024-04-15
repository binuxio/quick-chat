import { Socket } from "socket.io";
import { _Submit } from "../types";
import sendTextMsgToPartner from "./send/sendTextMsgToPartner";
import { usersMap } from "../users/usersDB";

export default function (submitObject: _Submit) {
    const socket: Socket = this
    if (!socket) throw new Error("Socket is undefined")
    console.log(submitObject)
    const partnerID = submitObject.toPartner.id
    const user = usersMap.get(partnerID)

    if (user) {
        const partnersSocketIDs = user.currentSocketIDs
        if (partnersSocketIDs.length == 0) {
            console.log("Receiver not online. Storing Message queueArray")
            const user = offlineReceiverMessagesQueue.find(u => u.userID = partnerID)
            if (user) {
                user.messages.push(submitObject)
            } else {
                offlineReceiverMessagesQueue.push({ userID: partnerID, messages: [submitObject] })
            }
        } else {
            sendTextMsgToPartner(submitObject, partnersSocketIDs, socket)
        }
    } else {
        // Actually impossible case because on the Client the user can send msg ony when his partner ID is valid
        console.log("Receiver not found")
        socket.emit("err-invalid-userID")
    }
}


export function checkMessagesInQueue(userID: number, socket: Socket) {
    const usersMessages = offlineReceiverMessagesQueue.find(u => u.userID === userID)
    if (usersMessages) {
        usersMessages.messages.forEach(m => sendTextMsgToPartner(m, [socket.id], socket))
    }
}

interface offlineReceiverMessagesQueue {
    userID: number
    messages: _Submit[]
}

const offlineReceiverMessagesQueue: offlineReceiverMessagesQueue[] = []