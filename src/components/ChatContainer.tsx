import Inputfield from './input/Inputfield.tsx'
import Chat from './chat/Chat.tsx'

const ChatContainer = () => {
    return (
        <>
            <Chat />
            <Inputfield />
        </>
    )
}
export default ChatContainer


/* tools and global variable */

export const fileUrls = new Map<string, string>()