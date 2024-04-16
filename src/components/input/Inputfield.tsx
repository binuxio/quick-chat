import { FormEvent, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store.ts'
import { addFiles, addToChat } from '../../redux/slices/chat.ts'
import { FileData, TextMessage, _Submit } from '../../types.ts'
import { SelectedFilesList } from './SelectedFilesList.tsx'
import transfer_text from '@/data-traffic/send/transfer_text.ts'
import { getFileID } from '@/utils.ts'


const Inputfield = () => {
    const selectedFiles: FileData[] = useSelector((state: RootState) => state.chat.selectedFiles)
    const partnerID: number | undefined = useSelector((state: RootState) => state.user.partnerID)
    const userID: number | undefined = useSelector((state: RootState) => state.user.userData.userID)
    const partnerUsername: string | undefined = useSelector((state: RootState) => state.user.partnerUsername)


    const dispatch = useDispatch()

    const textInputRef = useRef<HTMLDivElement>(null)
    const [textInput, setTextInput] = useState<string>("")
    const FormRef = useRef<HTMLFormElement>(null)

    async function submit(e: FormEvent) {
        console.log("submitting")
        if (partnerID == undefined || userID == undefined) return
        if (selectedFiles.length == 0 && textInput.length == 0) return

        const time = new Date().toISOString()
        const messageObject: TextMessage = {
            type: "text",
            fromUser: {
                id: userID,
                username: undefined
            },
            toPartner: {
                id: partnerID,
                username: partnerUsername
            },
            message: textInputRef.current!.innerText,
            time: time,
        }
        dispatch(addToChat(messageObject))
        const textFileID = new Date().getTime() + "-" + "text.txt"
        const submitObject: _Submit = {
            fromUser: {
                id: userID,
                username: undefined
            },
            toPartner: {
                id: partnerID,
                username: undefined
            },
            textMsgRef: textFileID,
            time: time,
            files: selectedFiles.map(file => {
                return {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    fileRef: getFileID(file)
                }
            })
        }
        transfer_text(textInputRef.current!.innerText, submitObject)

        textInputRef.current!.innerText = ""
        setTextInput(textInputRef.current!.innerText)
        textInputRef.current?.focus()
    }

    return (
        <>
            <SelectedFilesList />
            <form className="mt-auto w-full bg-white relative" onSubmit={e => { e.preventDefault(); submit(e); }} ref={FormRef}>
                <div className='flex w-full'>
                    <div className='flex py-1'>
                        <div className='border-r mt-auto'>
                            <input type="file" accept='' name="file-selector" id="file-selector" className="sr-only"
                                onInput={(e) => {
                                    // @ts-ignore
                                    const files: FileData[] = Array.from(e.target.files)
                                    dispatch(addFiles(files))
                                    // @ts-ignore
                                    e.target.value = null
                                }
                                } multiple />
                            <label htmlFor="file-selector" className="curso,0r-pointer h-full max-h-10 flex justify-center items-center py-3 px-2 text-red-400" role='button'>
                                <div className='ml-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" className="h-5 w-5" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 441 512.02">
                                        <path d="M324.87 279.77c32.01 0 61.01 13.01 82.03 34.02 21.09 21 34.1 50.05 34.1 82.1 0 32.06-13.01 61.11-34.02 82.11l-1.32 1.22c-20.92 20.29-49.41 32.8-80.79 32.8-32.06 0-61.1-13.01-82.1-34.02-21.01-21-34.02-50.05-34.02-82.11s13.01-61.1 34.02-82.1c21-21.01 50.04-34.02 82.1-34.02zM243.11 38.08v54.18c.99 12.93 5.5 23.09 13.42 29.85 8.2 7.01 20.46 10.94 36.69 11.23l37.92-.04-88.03-95.22zm91.21 120.49-41.3-.04c-22.49-.35-40.21-6.4-52.9-17.24-13.23-11.31-20.68-27.35-22.19-47.23l-.11-1.74V25.29H62.87c-10.34 0-19.75 4.23-26.55 11.03-6.8 6.8-11.03 16.21-11.03 26.55v336.49c0 10.3 4.25 19.71 11.06 26.52 6.8 6.8 16.22 11.05 26.52 11.05h119.41c2.54 8.79 5.87 17.25 9.92 25.29H62.87c-17.28 0-33.02-7.08-44.41-18.46C7.08 432.37 0 416.64 0 399.36V62.87c0-17.26 7.08-32.98 18.45-44.36C29.89 7.08 45.61 0 62.87 0h173.88c4.11 0 7.76 1.96 10.07 5l109.39 118.34c2.24 2.43 3.34 5.49 3.34 8.55l.03 119.72c-8.18-1.97-16.62-3.25-25.26-3.79v-89.25zm-229.76 54.49c-6.98 0-12.64-5.66-12.64-12.64 0-6.99 5.66-12.65 12.64-12.65h150.49c6.98 0 12.65 5.66 12.65 12.65 0 6.98-5.67 12.64-12.65 12.64H104.56zm0 72.3c-6.98 0-12.64-5.66-12.64-12.65 0-6.98 5.66-12.64 12.64-12.64h142.52c3.71 0 7.05 1.6 9.37 4.15a149.03 149.03 0 0 0-30.54 21.14H104.56zm0 72.3c-6.98 0-12.64-5.66-12.64-12.65 0-6.98 5.66-12.64 12.64-12.64h86.2c-3.82 8.05-6.95 16.51-9.29 25.29h-76.91zm277.27 25.48v22.18c0 4.32-3.66 7.97-7.98 7.97h-29.9v29.91c0 4.33-3.65 7.97-7.98 7.97h-22.18c-4.33 0-7.98-3.59-7.98-7.97v-29.91H275.9c-4.32 0-7.97-3.59-7.97-7.97v-22.18c0-4.38 3.59-7.97 7.97-7.97h29.91v-29.91c0-4.39 3.59-7.97 7.98-7.97h22.18c4.39 0 7.98 3.64 7.98 7.97v29.91h29.9c4.39 0 7.98 3.7 7.98 7.97z" />
                                    </svg>

                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='flex items-center py-1' style={{ width: "calc(100% - 5rem)" }}>
                        <div className='w-full max-h-[7rem] overflow-x-hidden overflow-y-auto relative chatInputField'>
                            <div className='p-2 focus:outline-none overflow-x-hidden h-full whitespace-pre-wrap break-words' autoFocus contentEditable
                                id='textInput'
                                ref={textInputRef}
                                onKeyDown={e => {
                                    if (e.shiftKey && e.key === "Enter") return
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
                                        FormRef.current?.dispatchEvent(syntheticEvent);
                                    }
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLDivElement
                                    setTextInput(target.textContent!)
                                }}
                            />
                            {textInput.length == 0 &&
                                <div className='top-1/2 -translate-y-1/2 left-2 absolute text-gray-500 pointer-events-none'>Nachricht</div>
                            }
                        </div>
                    </div>
                    <div className='flex py-1'>
                        <button className="p-2 text-white border-l mt-auto cursor-pointer" type='submit'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="rgb(125 211 252)" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 scale-125">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}

export default Inputfield