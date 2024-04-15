import React from 'react'
import { FileData } from '@/types.ts'

const ReceivedVideoField: React.FC<{ file: FileData, fileUrl: string, fromUserID: number }> = ({ file, fileUrl, fromUserID }) => {

    return (
        <div className='w-full'>
            <div className='mr-auto rounded-md bg-sky-800 border-[.2rem] border-sky-800 max-w-[75%]'>
                <div className='w-full bg-white'>
                    <video controls className='w-full'>
                        <source type={`video/mp4`} src={fileUrl} />
                        <p>Dein Browser unterstützt dieses Videoformat nicht</p>
                    </video>
                </div>
                <div className='truncate py-1 px-2 text-white text-sm text-end'>{file?.name}</div>
            </div>
            <div className='text-neutral-500 text-[11px] mt-0.5'>From: {fromUserID}</div>
        </div>
    )
}

export default ReceivedVideoField