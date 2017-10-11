const express = require("express");
const body = require("body-parser");

const app = express();
const PORT = 8000;

app.use(body.json());

app.get("/", function()
{
   console.log("Server accessed!");
});

app.listen(PORT);
console.log("Server launched!");