import { useEffect, useRef } from 'react'
import { RootState } from '@/redux/store.ts'
import { useDispatch, useSelector } from 'react-redux'
import { FileData, _Chat } from '../../types.ts';
import { addFiles } from '../../redux/slices/chat.ts';
import TextField from './TextField/index.tsx';
import FileField from './FileFields/index.tsx';

const Chat = () => {
  const chat: _Chat = useSelector((state: RootState) => state.chat.ChatHistory)
  const dispatch = useDispatch()

  const UploadBox = () => {
    return <div className='w-full h-full grid place-items-center'>
      <div className='border border-dashed border-gray-300 rounded-sm'>
        <input type="file" accept='' name="file-selector-box" id="file-selector-box" className="sr-only" onInput={e => {
          // @ts-ignore
          const files: FileData[] = Array.from(e.target.files)
          dispatch(addFiles(files))
          // @ts-ignore
          e.target.value = null
        }} multiple />
        <label htmlFor="file-selector-box" className="flex flex-col justify-center items-center p-10 space-y-4 cursor-pointer hover:bg-lime-50 transition-all duration-300">
          <div className=''>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-lime-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <div className='text-lime-600'>Dokument hochladen</div>
            <div className='text-[.7rem] mt-2 text-gray-500 text-center'>PDF, PNG, JPG, XLS ...</div>
          </div>
        </label>
      </div>
    </div>
  }

  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current?.scrollHeight + 100)
  }, [chat])

  return (
    <div className='bg-stone-100 overflow-x-hidden overflow-y-auto p-3 h-full ' ref={chatRef}>
      {chat.length != 0 &&
        <div className='flex flex-col space-y-3'>
          {chat.map((msgObject, key) => {
            if (msgObject.type == "file")
              return <FileField msgObject={msgObject} key={key} />
            else if (msgObject.type == "text")
              return <TextField msgObject={msgObject} key={key} />
          })}
        </div> || <UploadBox />
      }
    </div>
  )
}

export default Chat