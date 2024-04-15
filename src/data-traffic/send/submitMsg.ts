import { _Submit } from "@/types.ts";
import { checkSocket } from "../_socket.ts";

export default async function (messageObject: Partial<_Submit>) {
    try {
        const { socket } = await checkSocket()
        socket.emit("submit-msg", messageObject)
    } catch (err) {
        console.log(err)
        // TODO: Make error pop up
    }
}