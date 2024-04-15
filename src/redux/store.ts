import { configureStore } from '@reduxjs/toolkit'
import chat from './slices/chat.ts'
import user from './slices/user.ts'

export const store = configureStore({
    reducer: {
        chat: chat,
        user: user
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
