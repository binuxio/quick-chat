import React from "react"
import { RootState } from "@/redux/store.ts"
import { useDispatch, useSelector } from "react-redux"
import { FileData } from "../../types.ts"
import { fileUrls } from "../ChatContainer.tsx"
import { setSelectedFiles } from "@/redux/slices/chat.ts"
import { fileTransferInProgress } from "@/data-traffic/send/transfer_file.ts"
import { convertBytes, getFileID, getFileNumber } from "@/utils.ts"

export const SelectedFilesList: React.FC = React.memo(() => {
    const selectedFiles: FileData[] = useSelector((state: RootState) => state.chat.selectedFiles)

    if (!selectedFiles.length) return <></>

    return <div>
        <div className='flex flex-col max-h-[20rem] overflow-y-auto space-y-3 bg-sky-50 p-3 border-t border-t-sky-200'>
            {selectedFiles.map((file, index) => {
                return <SelectedFile file={file} index={index} key={index} />
            })}
        </div>
    </div>
})


const SelectedFile: React.FC<{ file: FileData, index: number }> = React.memo(({ file, index }) => {
    const selectedFiles: FileData[] = useSelector((state: RootState) => state.chat.selectedFiles)
    const dispatch = useDispatch()
    const fileID = getFileID(file)

    const removeFile = (index: number) => {
        fileTransferInProgress.set(fileID, { interrupted: true, file: file })
        const updatedFiles = [...selectedFiles];
        const removedFile = selectedFiles[index]
        updatedFiles.splice(index, 1);
        dispatch(setSelectedFiles(updatedFiles))
        fileUrls.delete(getFileID(removedFile))
    }

    let fileNumber = getFileNumber(file)
    const fileContainerElementID = "fileContainer-" + fileNumber
    const progressContainerElementID = "progressContainer-" + fileNumber
    const progressBarElementID = "progressBar-" + fileNumber
    const bytesProgressElementID = "bytesProgress-" + fileNumber

    return <div className="shadow border-l-4 border-sky-200 bg-white transition-[border-color] delay-300 duration-300" id={fileContainerElementID}>
        <div className="flex items-center justify-between">
            <div className='truncate py-2 px-3'>
                <span className="truncate text-base font-medium text-[#07074D]">
                    {file.name}
                </span>
            </div>
            <div className='h-8 w-8'>
                <button className="h-full w-full grid place-items-center" onClick={() => removeFile(index)}>
                    <svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z" fill="currentColor" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
        <div className='pb-2 px-3 gap-x-2 flex items-center' id={progressContainerElementID}>
            <div className='h-1.5 rounded-lg leading-none w-full bg-sky-200 overflow-hidden'>
                <div className='bg-sky-500 w-[0%] transition-all duration-300 testo h-full' id={progressBarElementID}></div>
            </div>
            <div className="text-xs w-max whitespace-nowrap" id={bytesProgressElementID} >
                0 / {convertBytes(file.size, true, file.size / 1024 >= 1000 ? "mb" : "kb")}
            </div>
        </div>
    </div>
})