import { ManagerOptions } from "socket.io-client";
import { SocketOptions } from "socket.io-client";
import { Socket, io } from "socket.io-client";
import continueFileTransfer from "./send/continueFileTransfer.ts";
import { setUserData } from "@/redux/slices/user.ts";
import { Dispatch } from "@reduxjs/toolkit";
// TODO: check for performance issues browser
// TODO: try to get the amounts of chunks of a blob wihtout itterating through blob

const socketOptions: Partial<ManagerOptions & SocketOptions> = { reconnection: true, path: "/ws" }
export default async function initSocket(): Promise<Socket | undefined> {
    return await new Promise((res, rej) => {
        if (window.socket) {
            res(window.socket)
            return
        }

        window.socket = io(socketOptions)
        let socket = window.socket

        socket.on("connect", () => {
            console.log("connected");
            continueFileTransfer()

            res(socket)

            if (!socket) return
            socket.on("message", (msg) => {
                console.log(msg)
            })

            socket.on("disconnect", (e) => {
                console.log("Socket Disconnected. Reason:", e)
                // TODO: notify the user about his bad network connection
            });

            socket.on("close", (e) => {
                console.log("Socket closed. Reason:,", e)
            })

            socket.on("error", (e) => rej(e))
        });
        socket.io.engine.on("error", (e) => {
            console.log("Socket Error:", e)
            rej(e)
        })
    })
}

export async function checkSocket(): Promise<{ socket: Socket }> {
    return new Promise((res, rej) => {
        const socket = window.socket
        if (socket?.connected) {
            console.log("Socket connected, ready for transfer")
            res({ socket: socket })
            return
        }
        if (socket?.active && !socket.connected) {
            rej("No connection")
            // TODO: notify user about his bad connection
            return
        }
    })
}

export function getUserData(dispatch: Dispatch) {
    window.socket!.emit("get-user-data", (userData: { userID: number }) => {
        window.userData = { id: userData.userID, username: undefined }
        dispatch(setUserData(userData))
    })
}

export async function validatePartnerID(inputNumber: number) {
    if (!window.socket) initSocket()
    return await window.socket?.emitWithAck("validate-partnerID", inputNumber)
}

export const defaultChunkSize = 1024 * 1024
function getAdjustedChunkSize() {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || { default: "default" };
    const effectiveType = connection.effectiveType;

    switch (effectiveType) {
        case 'slow-2g':
            return defaultChunkSize / 6;
        case '2g':
            return defaultChunkSize / 4;
        case '3g':
            return defaultChunkSize / 2;
        default:
            return defaultChunkSize;
    }
}

window.chunkSize = getAdjustedChunkSize()