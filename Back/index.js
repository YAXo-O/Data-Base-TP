const express = require("express");
const body = require("body-parser");
const db = require("./Modules/dataBase.js").db;

const forumRouter = require("./Modules/Routers/forumRouter.js").forumRouter;
const postRouter = require("./Modules/Routers/postRouter.js").postRouter;
const serviceRouter = require("./Modules/Routers/serviceRouter.js").serviceRouter;
const threadRouter = require("./Modules/Routers/threadRouter.js").threadRouter;
const userRouter = require("./Modules/Routers/userRouter.js").userRouter;

const app = express();
const PORT = 5000;

app.use(body.json())
    .use("/api/forum", forumRouter)
    .use("/api/post", postRouter)
    .use("/api/service", serviceRouter)
    .use("/api/thread", threadRouter)
    .use("/api/user", userRouter);

app.listen(PORT);
console.log("Server launched!");