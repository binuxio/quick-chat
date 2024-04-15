import { Socket } from "socket.io";
import { usersMap } from "./usersDB";

export function sendUserData(callback: ({ }) => void) {
    const socket: Socket = this
    //@ts-ignore
    callback(socket.request.session.user)
}

export function setUserSocketID(socket: Socket) {
    const socketID = socket.id
    //@ts-ignore
    const userID = socket.request.session.user.userID
    //@ts-ignore
    const username = socket.request.session.user.username
    const user = usersMap.get(userID)

    if (user) {
        user.currentSocketIDs.push(socketID)
    } else {
        usersMap.set(userID, {
            username: username,
            currentSocketIDs: [socketID]
        })
    }
}

export function removeSocketID(socket: Socket) {
    const socketID = socket.id
    //@ts-ignore
    const userID = socket.request.session.user.userID
    const user = usersMap.get(userID)
    const newSocketIDList = user.currentSocketIDs.filter(sID => sID != socketID)
    user.currentSocketIDs = newSocketIDList
}

export function validatePartnerID(partnerID: number, callback: (isValid: boolean) => void) {
    const user = usersMap.get(partnerID)
    if (user) callback(true)
    else callback(false)
}