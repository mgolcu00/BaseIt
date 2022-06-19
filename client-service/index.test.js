const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));



const isLoggerOpen = true
console.log = (function () {
    var old = console.log;
    if (isLoggerOpen) {
        return function (msg) {
            old.apply(console, arguments);
        }
    }
    else {
        return function () { };
    }
})()


if (dotenv.config()) {
    console.log('dotenv config success');
    config.init(
        {
            client_topic_name: process.env.CLIENT_TOPIC_NAME,
            server_topic_name: process.env.SERVER_TOPIC_NAME,
            server_url: process.env.SERVER_URL
        }
    )
} else {
    console.log('dotenv config failed');
}


const port = process.env.PORT || 8000;
const host = process.env.HOST || '0.0.0.0'
const server = app.listen(port, host, () => {
    console.log(`server started at http://${host}:${port}`);
});


const {realtime} = require('./src/routers');
app.use('/api/realtime', realtime);

