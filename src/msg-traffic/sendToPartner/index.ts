import { messageQueueMap } from "../handleMessageTraffic";
import send from "./send";

export default async function (receiverID: number) {
    const receiversQueue = messageQueueMap.get(receiverID);
    if (receiversQueue) {
        const deliveredMessages_id: string[] = []
        await Promise.all(receiversQueue.map(async (message) => {
            const success = await send(receiverID, message);
            success && deliveredMessages_id.push(message._id)
        }));
        console.log("delivered msgs", deliveredMessages_id)
        const receiversQueue2 = messageQueueMap.get(receiverID);
        let newQueue = receiversQueue2.filter(message => !deliveredMessages_id.includes(message._id));
        messageQueueMap.set(receiverID, newQueue);
    }
}   