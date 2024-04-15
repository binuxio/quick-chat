import { Socket } from "socket.io-client"

export type FileData = {
    size: number
    lastModified?: number
    name: string
    type: string
    fileRef?: string
}

export type _Chat = Array<Partial<FileMessage> | Partial<TextMessage>>

export type User = { id: number, username: undefined | string }

export type FileMessage = {
    type: "file"
    file: FileData
    fileRef?: string
    fromUser: User
    toPartner: User
    time: string
}

export type TextMessage = {
    type: "text"
    message: string
    fromUser: User
    toPartner: User
    time: string
}

export type _Submit = {
    fromUser: User
    toPartner: User
    textMsgRef: string
    files: FileData[]
    time: string
}

declare global {
    interface Window {
        chunkSize: number
        socket: Socket | undefined
        userData: User
    }
}