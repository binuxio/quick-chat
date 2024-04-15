import { TextMessage } from "@/types.ts"
import React from "react"

const TextField: React.FC<{ msgObject: Partial<TextMessage> }> = React.memo(({ msgObject }) => {
    const { message, fromUser, toPartner, time } = msgObject

    const iamtheSender = fromUser?.id === window.userData.id

    return <div className='w-full flex'>
        <div className={`${iamtheSender ? "ml-auto" : "mr-auto"} max-w-[70%]`}>
            <div className={`${iamtheSender ? "ml-auto" : "mr-auto"} rounded-lg px-3 py-1 bg-sky-800 w-max text-[15px] text-white whitespace-pre-wrap break-all`}>
                {message}
            </div>

            {iamtheSender ?
                <div className='text-neutral-500 text-[11px] mt-0.5 text-end whitespace-nowrap'>To: {toPartner?.id} {toPartner?.username}</div>
                : <div className='text-neutral-500 text-[11px] mt-0.5'>From: {fromUser?.id} {fromUser?.username}</div>
            }
        </div>
    </div >
})

export default TextField