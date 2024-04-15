import express from "express";
import { serialize } from "cookie"
import { generateUserID } from "../utils";

export default function (headers: any, request: express.Request) {
    if (!request.cookies.connectID) {
        headers["set-cookie"] = serialize("connectID", request.sessionID, { sameSite: "strict", path: "/" })
        // @ts-ignore
        request.session.user = { userID: generateUserID() }
        console.log("Create new User. Set cookies")
    }
    // @ts-ignore
    else if (request.session.user == undefined) {
        headers["set-cookie"] = serialize("connectID", request.sessionID, { sameSite: "strict", path: "/" })
        // @ts-ignore
        request.session.user = { userID: generateUserID() }
        console.log("Cookies not found in DB. Create new user")
    } else {
        console.log("User is authenticated")
    }
}