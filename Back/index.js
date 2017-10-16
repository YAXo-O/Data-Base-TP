const express = require("express");
const body = require("body-parser");

const forumRouter = require("./Modules/Routers/forumRouter.js").forumRouter;
const postRouter = require("./Modules/Routers/postRouter.js").postRouter;
const serviceRouter = require("./Modules/Routers/serviceRouter.js").serviceRouter;
const threadRouter = require("./Modules/Routers/threadRouter.js").threadRouter;
const userRouter = require("./Modules/Routers/userRouter.js").userRouter;

const app = express();
const PORT = 8000;

app.use(body.json())
    .use("/forum", forumRouter)
    .use("/post", postRouter)
    .use("/service", serviceRouter)
    .use("/thread", threadRouter)
    .use("/user", userRouter);

app.listen(PORT);
console.log("Server launched!");