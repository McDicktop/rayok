// require('dotenv').config({ path: '../.env'});
require('dotenv').config({});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require("./routes/event.router.js");
const authRouter = require("./routes/auth.router.js");
const mediaRouter = require("./routes/mediaProxy.router.js");

const port = process.env.PORT || 8080;

const app = express();
const fs = require('fs');
const path = require('path')

app.use(express.json());
app.use(cors());

app.use("/", router);
app.use("/auth", authRouter);
app.use("/media", mediaRouter)





const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to DB');
        app.listen(port, () => console.log('Server starts on port', port))
    } catch (e) {
        console.log(e)
    }
}

start();