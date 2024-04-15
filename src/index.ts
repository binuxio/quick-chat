import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import session from "express-session"
import cookieParser from "cookie-parser"
import { config } from "dotenv"; config();
const isProduction = process.env.NODE_ENV === "development" ? false : true

import requesttransfer from "./msg-traffic/receive-msgs/requesttransfer";
import chunksreceiver from "./msg-traffic/receive-msgs/chunksreceiver";
import transfercompleted from "./msg-traffic/receive-msgs/transfercompleted";
import sessionHandler from "./users/sessionHandler";
import { removeSocketID, validatePartnerID, sendUserData, setUserSocketID } from "./users/handleUserData";
import handleMessageTraffic, { checkMessagesInQueue } from "./msg-traffic/handleMessageTraffic";
import { logger } from "./utils";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        methods: "*",
        origin: isProduction ? ["http://10.0.0.2:3080", "http://localhost:3080"] : "*",
        credentials: true,
    },
    connectionStateRecovery: { maxDisconnectionDuration: 0 },
    // pingTimeout: 20000,
    maxHttpBufferSize: 1024 * 2024 + 1000,
    path: "/ws"
})

const sessionMiddleware = session({
    secret: "hallo-secret",
    name: "connectID",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 365
    },
});
io.engine.use(sessionMiddleware);
io.engine.use(cookieParser())

io.engine.on("initial_headers", (headers: any, request: express.Request) => {
    sessionHandler(headers, request)
});

io.on('connection', (socket) => {
    //@ts-ignore
    logger(`New socket connection ${socket.request.session.user.userID}`)
    socket.on('disconnect', () => {
        logger("User disconnected")
        removeSocketID(socket)
    });
    /* init user */
    socket.join(socket.id)
    setUserSocketID(socket)
    socket.on("get-user-data", sendUserData)

    /* File Transfer */
    socket.on("request-transfer", requesttransfer)
    socket.on("file-transfer", chunksreceiver);
    socket.on("transfer-completed", transfercompleted)

    /* submit */
    socket.on("submit-msg", handleMessageTraffic)
    socket.on("validate-partnerID", validatePartnerID)

    //@ts-ignore
    // Send all messages that are queued for him
    checkMessagesInQueue(socket.request.session.user.userID, socket)
});

const port = 4050
// const host = "0.0.0.0"
const host = "localhost"
httpServer.listen(port, host, () =>
    console.log(`Server running: http://${host}:${port}`)
)
