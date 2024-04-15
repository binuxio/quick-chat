import React from 'react'
import { FileData } from '@/types.ts';
import { convertBytes } from '@/utils.ts';

const ReceivedAnyFileField: React.FC<{ file: FileData, fileUrl: string, fromUserID: number }> = ({ file, fileUrl, fromUserID }) => {
  let fileType = file?.type && file?.type.split("/")[1].toLocaleLowerCase() || "unknown"

  let FileIcon: React.FC = () => <></>
  switch (fileType) {
    case "pdf":
      FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className='h-10 my-auto' viewBox="0 0 512 512" fill='white'>
        <path d="M64 464H96v48H64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V288H336V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56H192v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V448 368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H192v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H304c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H320v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V432 368z" />
      </svg>
      break;
    case "image":
      FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className='h-10 my-auto' viewBox="0 0 512 512" fill='white'>
        <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
      </svg>
      break;
    default:
      FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className='h-10 my-auto' fill='white'>
        <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
      </svg>
      break;
  }

  return <a href={fileUrl} download={file.name} className='bg-sky-900 mr-auto rounded-md w-fit max-w-[80%] p-1'>
    <div className='flex'>
      <div className='flex mx-2'>
        <FileIcon />
      </div>
      <div className='bg-sky-800 p-2 rounded overflow-hidden' style={{ width: "calc(100% - 2rem)" }}>
        <div className='break-words text-white'>{file?.name}</div>
        <div className='flex text-xs gap-x-1 text-gray-200 items-center flex-wrap'>
          <div>{convertBytes(file.size)}</div>
          <div className='rounded-full bg-gray-300 w-1 h-1'></div>
          <div className='break-words'>{file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toUpperCase()}</div>
        </div>
      </div>
    </div>
  </a>
}

export default ReceivedAnyFileField