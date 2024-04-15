import React, { useState } from "react"
import transfer_file, { fileTransferInProgress } from "@/data-traffic/send/transfer_file.ts"
import { FileData } from "@/types.ts"
import { convertBytes, getFileID, getFileNumber } from "@/utils.ts"


export const ProgressBox: React.FC<{ file: FileData, color?: string }> = React.memo(({ file, color = "white" }) => {
    const fileID = getFileID(file) 
    let fileNumber = getFileNumber(file)
    const progressContainerElementID = "progressContainer-" + fileNumber
    const progressBarElementID = "progressBar-" + fileNumber
    const bytesProgressElementID = "bytesProgress-" + fileNumber

    const [fileUploadCanceled, setFileUploadCanceled] = useState(false)

    const toggleFileTransferProgress = () => {
        if (fileUploadCanceled) {
            transfer_file(file)
            setFileUploadCanceled(false)
            return
        }
        fileTransferInProgress.set(fileID, { interrupted: true, file: file })
        setFileUploadCanceled(true)
    }

    return <div className='p-2 w-full flex gap-x-2 items-center' id={progressContainerElementID}>
        <button className="h-full w-5 grid place-items-center" onClick={() => toggleFileTransferProgress()}>
            {!fileUploadCanceled &&
                <svg width={10} height={10} style={{ color: color }} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z" fill="currentColor" />
                </svg> ||
                <svg xmlns="http://www.w3.org/2000/svg" height={10} width={10} viewBox="0 0 512 512">
                    <path fill={color} d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                </svg>}
        </button>
        <div className='h-1.5 rounded-lg w-full bg-sky-200 overflow-hidden'>
            <div className='bg-sky-500 w-[0%] transition-all delay-75 duration-300 h-full' id={progressBarElementID}></div>
        </div>
        <div className="text-xs w-max whitespace-nowrap" id={bytesProgressElementID} style={{ color: color }}>
            0 / {convertBytes(file.size, true, file.size / 1024 >= 1000 ? "mb" : "kb")}
        </div>
    </div>
})