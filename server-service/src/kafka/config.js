const settings = require('../settings');
module.exports = {
    kafkaHost: settings.kafkaHost || 'localhost:9092',
    server_topic_name: settings.server_topic_name || 'server_topic',
    client_topic_name: settings.client_topic_name || 'client_topic',
}