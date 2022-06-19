let kafkaHost = 'localhost:9092';
let client_topic_name = "realtime-client-1"
let server_topic_name = "realtime-server-1"

const init = (options) => {
    if (options) {
        kafkaHost = options.kafkaHost || kafkaHost;
        server_topic_name = options.server_topic_name || server_topic_name;
        client_topic_name = options.client_topic_name || client_topic_name;
    }
}

module.exports = {
    init,
    kafkaHost,
    server_topic_name,
    client_topic_name
}

