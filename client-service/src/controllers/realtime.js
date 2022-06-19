const kafkaClient = require('../kafka');
const axios = require('axios');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');



const clients = []

const create = (req, res) => {
    console.log(req);
    axios.post(`${config.server_url}/realtime/create`)
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

const getData = (req, res) => {
    axios.get(`${config.server_url}/realtime/data`)
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

const setData = (req, res) => {
    const data = req.body.data;
    if (!data) {
        res.status(500).json({
            message: 'Data is required'
        });
        return;
    }
    const payload = {
        event: 'setData',
        data: data
    }
    kafkaClient.sendData(config.server_topic_name, JSON.stringify(payload));
}
const stop = (req, res) => {
    const id = req.body.id;
    const payload = {
        event: 'stop',
        data:{
            id: id
        }
    }
    removeClient(id);
}

const listen = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    const cl = {
        id: uuidv4(),
        req: req,
        res: res
    }
    addClient(cl);
    const payload = {
        event: 'init',
        data: {
            id: cl.id
        }
    }
    kafkaClient.sendData(config.server_topic_name, JSON.stringify(payload));
   
}

const addClient = (c) => {
    clients.push(c);
    console.log('[INFO](last added) :', clients[clients.length - 1].id);
}

const removeClient = (id) => {
    const index = clients.findIndex(client => client.id == id);
    if (index > -1) {
        clients[index].res.end();
        clients.splice(index, 1);
    }
    console.log('[INFO](last removed) :', id);
}
const emit = (data) => {
    clients.forEach(c => {
        c.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

kafkaClient.listenData(config.client_topic_name, (message) => {
    try {
        const jsonData = JSON.parse(message.value);
        emit(jsonData)   // emit data to all clients
    } catch (error) {
        console.log('[ERROR] : ', error);
    }
});


























const emitSSEData = (data) => {
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    })
}

// kafkaClient.listenData(config.client_topic_name, (message) => {
//     try {
//         const jsonData = JSON.parse(message.value);
//         emitSSEData(jsonData)   // emit data to all clients
//     } catch (error) {
//         console.log('[ERROR] : ', error);
//     }
//     console.log('[INFO](clients size) : ', clients.length);
// });

const clearClients = () => {
    clients.forEach(client => {
        // if client is not connected
        if (client.res.readyState === client.res.CLOSED) {
            const index = clients.findIndex(client => client.id === client.id);
            clients.splice(index, 1);
        }
    })
    console.log('[WARN] : Clients : ', clients.length);
}






const listenData = (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    clients.push({
        id: req.query.id,
        req: req,
        res: res
    });
    console.log('[INFO](last added) :', clients[clients.length - 1].id);
    axios.get(`${config.server_url}/realtime/data`)
        .then(response => {
            res.write(`data: ${JSON.stringify(response.data.data)}\n\n`);
        })
}

const stopListening = (req, res) => {
    const index = clients.findIndex(client => client.id === req.body.id);
    clients.splice(index, 1);
    console.log('[INFO](last removed) :', req.body.id);
    res.end();
}

const sendData = (req, res) => {
    const data = req.body;
    if (!data) {
        res.status(500).json({
            message: 'Data is required'
        });
    }
    kafkaClient.sendData(config.server_topic_name, JSON.stringify(data));
    res.status(200).json(data);
}

const putData = (req, res) => {
    const data = req.body.data;
    const ref = req.body.ref;
    if (!data) {
        res.status(500).json({
            message: 'Data is required'
        });
    }
    axios.get(`${config.server_url}/realtime/data`)
        .then(response => {
            let data1 = response.data.data;
            data1[ref] = data;

            kafkaClient.sendData(config.server_topic_name, JSON.stringify(data1));
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

const getStatus = (req, res) => {
    axios.get(`${config.server_url}/realtime/data`)
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            if (err.response) {
                res.status(err.response.status).json({
                    error: err.response.data
                });
            }
            else {
                res.status(500).json({
                    error: err
                });
            }
        })
}


const createRealtimeDatabase = (req, res) => {
    axios.post(`${config.server_url}/realtime/create`)
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            if (err.response) {
                res.status(err.response.status).json({
                    error: err.response.data
                });
            } else {
                res.status(500).json({
                    error: err
                });
            }
        })
}


module.exports = {
    listenData,
    sendData,
    getStatus,
    createRealtimeDatabase,
    putData,
    stopListening,
    create,
    listen,
    getData,
    setData,
    addClient,
    removeClient,
    stop,
}