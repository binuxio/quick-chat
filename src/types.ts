export type FileInterface = {
    size: number
    lastModified: number
    name: string
    type: string
}

export type FileMessage = {
    type: "file"
    downloadUrl: string
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
    textMsgID: string
    filesRef: string[]
    time: string
}

type User = {
    id: number
    username: undefined | string
}