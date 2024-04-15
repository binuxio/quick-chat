export type FileData = {
    size: number
    lastModified: number
    name: string
    type: string
    fileRef?: string
}

export type FileMessage = {
    type: "file"
    file: FileData
    fileRef?: string
    fromUser: User
    toPartner: User
    time: string
    _id: string
}

export type TextMessage = {
    type: "text"
    fromUser: User
    toPartner: User
    message?: string
    textMsgRef?: string
    time: string
    _id: string
}

export type _Submit = {
    fromUser: User
    toPartner: User
    textMsgRef: string
    files: FileData[]
    time: string
}

type User = {
    id: number
    username: undefined | string
}