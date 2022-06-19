let client_topic_name = "realtime-client-1"
let server_topic_name = "realtime-server-1"
let server_url = "http://localhost:9090"

const init = (options) => {
    if (options) {
        client_topic_name = options.client_topic_name || client_topic_name;
        server_topic_name = options.server_topic_name || server_topic_name;
        server_url = options.server_url || server_url;
    }
}


module.exports = {
    init,
    client_topic_name,
    server_topic_name,
    server_url
}