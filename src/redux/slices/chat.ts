import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { fileUrls } from '@/components/ChatContainer.tsx';
import { parallel } from 'async';
import transfer_file from '@/data-traffic/send/transfer_file.ts';
import { FileData, FileMessage, TextMessage, _Chat } from '@/types.ts';
import { getFileID } from '@/utils.ts';

export interface FilesUploadProgressInterface {
    fileID: string
    progress: number
}

type State = {
    ChatHistory: _Chat
    selectedFiles: FileData[]
    uploadProgress: FilesUploadProgressInterface[]
}

const initialState: State = {
    ChatHistory: [],
    selectedFiles: [],
    uploadProgress: []
}

export const chat = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addToChat: (state, action: PayloadAction<TextMessage | FileMessage>) => {
            state.selectedFiles.forEach(file => state.ChatHistory.push({
                type: "file",
                time: action.payload.time,
                file,
                fromUser: action.payload.fromUser,
                toPartner: {
                    id: action.payload.toPartner.id,
                    username: action.payload.toPartner.username
                }
            }));
            state.selectedFiles = new Array()
            if (action.payload.type === "text") {
                const textInput = action.payload.message
                if (!/^\s*$/.test(textInput))
                    state.ChatHistory.push(action.payload)
            }
        },
        addIncomingMessageToChat: (state, action: PayloadAction<TextMessage | FileMessage>) => {
            console.log('adding incoming', action.payload);

            if (action.payload.type == "text") {
                state.ChatHistory.push(action.payload)
                console.log(current(state.ChatHistory))
                return
            } else if (action.payload.type == "file") {
                state.ChatHistory.push(action.payload)
            }
        },
        addFiles: (state, action: PayloadAction<FileData[]>) => {
            const newFiles = action.payload.filter(file => !fileUrls.get(getFileID(file)))
            newFiles.forEach(file => state.selectedFiles.push(file))
            parallel(newFiles.map(file => (callback: (error: Error | null, result?: string) => void) => {
                const reader = new FileReader();
                reader.readAsDataURL(file as any);
                reader.onload = () => {
                    const fileID = getFileID(file);
                    const fileDataURL = reader.result!.toString();
                    fileUrls.set(fileID, fileDataURL)
                    callback(null, "");
                    transfer_file(file)
                };
            }))
        },
        setSelectedFiles: (state, action) => {
            state.selectedFiles = action.payload
        },
    },
})

export const { addToChat, setSelectedFiles, addFiles, addIncomingMessageToChat } = chat.actions
export default chat.reducer

