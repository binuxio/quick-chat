import React from 'react'
import { fileUrls } from '../../../ChatContainer.tsx'
import { ProgressBox } from '../ProgressBox.tsx'
import { FileData } from '@/types.ts'
import { getFileID } from '@/utils.ts'

const VideoField: React.FC<{ file: FileData }> = ({ file }) => {
  // const fileType = file?.type && file?.type.split("/")[1].toLocaleLowerCase() || "unknown"
  console.log(fileUrls)
  return (
    <div className='w-full'>
      <div className='ml-auto rounded-md bg-sky-800 border-[.2rem] border-sky-800 max-w-[75%]'>
        <div className='w-full bg-white'>
          <video controls className='w-full'>
            <source type={`video/mp4`} src={fileUrls.get(getFileID(file)) || ""} />
            <p>Dein Browser unterstützt dieses Videoformat nicht</p>
          </video>
        </div>
        <div className='truncate py-1 px-2 text-white text-sm text-end'>{file?.name}</div>
        <ProgressBox file={file} />
      </div>
    </div>
  )
}

export default VideoField