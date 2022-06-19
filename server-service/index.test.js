const express = require('express');
const cors = require('cors');
const settings = require('./src/settings');

const app = express();

app.use(express.json({
    limit: '50mb'
}));
app.use(cors({
    origin: true,
    credentials: true
}));

// get args with keys

/*
    usage app 
    node index.js kafkaHost=<KafkaHost> server_topic_name=<server_topic_name>(optionel) client_topic_name=<client_topic_name>(optionel)
*/
const args = process.argv.slice(2);
if (args.length != 0) {
    let obj = {};
    args.forEach(arg => {
        let key = arg.split('=')[0];
        let value = arg.split('=')[1];
        obj[key] = value;
    });
    settings.init(obj);
}


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

const port = process.env.PORT || 9090;
const host = process.env.HOST || '0.0.0.0'
const server = app.listen(port, host, () => {
    console.log(`Server is running\nhttp://${host}:${port}`);

})



const router = require('./src/routes');
app.use('/', router);

//require('./src/kafka');
