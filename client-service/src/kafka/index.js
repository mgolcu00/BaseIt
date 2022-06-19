const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const producer = new kafka.Producer(client);

producer.on('ready', function () {
    console.log('producer is ready');
});


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
        console.log(err);
    })
}

const sendData = (tn, data) => {
    producer.send([
        {
            topic: tn,
            messages: data
        }
    ], (err, data1) => {
        if (err) {
            
        } else {
            
        }
    });
}

module.exports = {
    sendData,
    listenData
}
