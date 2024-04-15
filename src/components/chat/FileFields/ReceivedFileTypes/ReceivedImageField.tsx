import React, { FC } from 'react'
import { fileUrls } from '@/components/ChatContainer.tsx'
import { ProgressBox } from '../ProgressBox.tsx'
import { FileData } from '@/types.ts'
import { getFileID } from '@/utils.ts'

const ReceivedImageField: React.FC<{ file: FileData, fileUrl: string, fromUserID: number }> = ({ file, fileUrl, fromUserID }) => {
    const fileType = file?.type && file?.type.split("/")[1].toLocaleLowerCase() || "unknown"
    const FileImage = () => <img src={fileUrl} className='mr-auto w-full' alt='Bild konnte nicht geladen werden' />

    console.log("fileurl", fileUrl)

    const DownLoadButton: FC<{ children: React.ReactNode }> = ({ children }) => {
        return <a download={file.name} href={fileUrl} className='w-full'>{children}</a>
    }

    if (fileType == "svg+xml") {
        return <div className=''>
            <div className='p-2 mr-auto rounded-md border-sky-800 w-[20%] max-w-[7rem]'>
                <FileImage />
            </div>
            <DownLoadButton>
                <div className='truncate underline max-w-[60%] py-1 px-2 bg-gray-100 text-sm rounded text-end w-fit mr-auto'>{file?.name}</div>
            </DownLoadButton>
            <div className='text-neutral-500 text-[11px] mt-0.5'>From: {fromUserID}</div>
        </div>
    } else if (fileType == "png") {
        return <div className=''>
            <div className='mr-auto rounded-md border-[.1rem] border-sky-800 w-fit max-w-[60%]'>
                <FileImage />
                <DownLoadButton>
                    <div className='truncate underline py-1 px-2 text-white bg-sky-800 text-sm text-end'>{file?.name}</div>
                </DownLoadButton>
            </div>
            <div className='text-neutral-500 text-[11px] mt-0.5'>From: {fromUserID}</div>
        </div>
    } if (["jpg", "jpeg", "webp", "gif"].includes(fileType!)) {
        return <div className=''>
            <div className='mr-auto rounded-md bg-sky-800 border-[.2rem] border-sky-800 w-fit max-w-[60%]'>
                <FileImage />
                <DownLoadButton>
                    <div className='truncate underline py-1 px-2 text-white bg-sky-800 text-sm text-end'>{file?.name}</div>
                </DownLoadButton>
            </div>
            <div className='text-neutral-500 text-[11px] mt-0.5'>From: {fromUserID}</div>
        </div>
    }
}

export default ReceivedImageField