import React from 'react'
import { fileUrls } from '@/components/ChatContainer.tsx'
import { ProgressBox } from '../ProgressBox.tsx'
import { FileData } from '@/types.ts'
import { getFileID } from '@/utils.ts'

const ImageField: React.FC<{ file: FileData }> = ({ file }) => {
    const fileType = file?.type && file?.type.split("/")[1].toLocaleLowerCase() || "unknown"
    const FileImage = () => <img src={fileUrls.get(getFileID(file)) || ""} className='ml-auto w-full' alt='Bild konnte nicht geladen werden' />

    if (fileType == "svg+xml") {
        return <div className=''>
            <div className='p-2 ml-auto rounded-md border-sky-800 w-[20%] max-w-[7rem]'>
                <FileImage />
            </div>
            <ProgressBox file={file} color='black' />
            <div className='truncate max-w-[60%] py-1 px-2 bg-gray-100 text-sm rounded text-end w-fit ml-auto'>{file?.name}</div>
        </div>
    } else if (fileType == "png") {
        return <div className=''>
            <div className='ml-auto rounded-md border-[.1rem] border-sky-800 w-fit max-w-[60%]'>
                <FileImage />
                <div className='truncate py-1 px-2 text-black text-sm text-end'>{file?.name}</div>
                <ProgressBox file={file} color='black' />
            </div>
        </div>
    } if (["jpg", "jpeg", "webp", "gif"].includes(fileType!)) {
        return <div className=''>
            <div className='ml-auto rounded-md bg-sky-800 border-[.2rem] border-sky-800 w-fit max-w-[60%]'>
                <FileImage />
                <div className='truncate py-1 px-2 text-white text-sm text-end'>{file?.name}</div>
                <ProgressBox file={file} />
            </div>
        </div>
    }
}

export default ImageField