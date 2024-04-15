import { lastChunkReceived } from "./chunksreceiver"

export default function (transferDetails: any) {
    const userID = this.request.session.user.userID.toString()
    const { filename } = transferDetails
    console.log(filename, "transfer completed")
    const fileProgressID = userID + "-" + filename
    lastChunkReceived.delete(fileProgressID)
}