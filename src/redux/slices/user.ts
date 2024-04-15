import { createSlice } from '@reduxjs/toolkit'

export interface UserData {
    userID: number | undefined
    username: string | undefined
}

type State = {
    userData: UserData
    partnerID: number | undefined
    partnerUsername: string | undefined
}

const initialState: State = {
    partnerID: undefined,
    partnerUsername: undefined,
    userData: { userID: undefined, username: undefined }
}

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action) {
            state.userData = action.payload
        },
        setPartnerID(state, action) {
            state.partnerID = action.payload
        },
        setPartnerUsername(state, action) {
            state.partnerUsername = action.payload
        }
    },
})

export const { setUserData, setPartnerID } = user.actions
export default user.reducer

