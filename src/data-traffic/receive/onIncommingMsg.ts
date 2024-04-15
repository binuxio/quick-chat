import { addIncomingMessageToChat } from "@/redux/slices/chat.ts";
import { Dispatch } from "@reduxjs/toolkit";
import { FileMessage, TextMessage, _Submit } from "@/types.ts";

export default function (msgObject: TextMessage | FileMessage, dispatch: Dispatch) {
    dispatch(addIncomingMessageToChat(msgObject))
}