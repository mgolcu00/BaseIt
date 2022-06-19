const kafka = require('kafka-node');
const client = new kafka.KafkaClient({
    kafkaHost: require('./config').kafkaHost
});
const producer = new kafka.Producer(client);

producer.on('ready', () => {
    console.log('producer is ready');
});

const sendData = (tn, data) => {
    producer.send([
        {
            topic: tn,
            messages: data
        }
    ], (err, data1) => {
        if (err) {
            console.log(err);
        } else {
            console.log('[SENDED] : ', data1);
        }
    });
}

const listenData = (tn, cb) => {
    const consumer = new kafka.Consumer(client, [{
        topic: tn,
        partition: 0
    }], {
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8'

    });
    consumer.on('message', (message) => {
        cb(message);
    });
    consumer.on('error', (err) => {
        console.log('[ERROR] : ', err);
    })
}

module.exports = {
    sendData,
    listenData
}
