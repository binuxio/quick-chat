import { FileMessage } from "@/types.ts"
import React from "react"
import ImageField from "./FileTypes/ImageField.tsx"
import VideoField from "./FileTypes/VideoField.tsx"
import AnyFileField from "./FileTypes/AnyFileField.tsx"
import ReceivedImageField from "./ReceivedFileTypes/ReceivedImageField.tsx"
import ReceivedVideoField from "./ReceivedFileTypes/ReceivedVideoField.tsx"
import ReceivedAnyFileField from "./ReceivedFileTypes/ReceivedAnyFileField.tsx"

const FileField: React.FC<{ msgObject: FileMessage }> = React.memo(({ msgObject }) => {
    const mimeType = msgObject.file?.type && msgObject.file?.type.split("/")[0].toLocaleLowerCase() || "unknown"
    console.log("rendering FileField")

    const fileUrl = `/api/file?fromUserID=${msgObject.fromUser.id}&fileRef=${msgObject.file.name}`
    const iamthesender = msgObject.fromUser.id === window.userData.id

    if (mimeType == "image") {
        if (iamthesender)
            return <ImageField file={msgObject.file} />
        return <ReceivedImageField file={msgObject.file} fileUrl={fileUrl} fromUserID={msgObject.fromUser.id} />
    }
    else if (mimeType == "video") {
        if (iamthesender)
            return <VideoField file={msgObject.file} />
        return <ReceivedVideoField file={msgObject.file} fileUrl={fileUrl} fromUserID={msgObject.fromUser.id} />
    }
    if (iamthesender)
        return <AnyFileField file={msgObject.file} />
    return <ReceivedAnyFileField file={msgObject.file} fileUrl={fileUrl} fromUserID={msgObject.fromUser.id} />
})

export default FileField