const filemanager = require('../filemanager');
const controller = require('../kafka/controller');
const config = require('../kafka/config');

const create = (req, res) => {
    filemanager.createRealtimeDatabase()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}

const getData = (req, res) => {
    filemanager.getData()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}
const setData = (req, res) => {
    const data = req.body;
    filemanager.insertData(filedata)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}


controller.listenData(config.server_topic_name, (message) => {
    try {
        const { event, data } = JSON.parse(message.value);
        switch (event) {
            case 'setData':
                filemanager.insertData(data)
                    .then(data1 => {
                        const fd = {
                            data: data1,
                        }
                        controller.sendData(config.client_topic_name, JSON.stringify(fd));
                    })
                    .catch(err => {
                        throw err;
                    })
                break;

                
            case 'init':
                filemanager.getData()
                    .then(data1 => {
                        const fd = {
                            data: data1,
                            session_id: data.id
                        }
                        controller.sendData(config.client_topic_name, JSON.stringify(fd));
                    })
                    .catch(err => {
                        throw err;
                    })
                break;
        }
    }
    catch (err) {
        controller.sendData(config.server_topic_name, JSON.stringify(err));
    }
});




















const getDataOnFile = (req, res) => {
    filemanager.getData()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            if (err.code === 'ENOENT') {
                res.status(404).json({
                    message: 'File not found'
                })
            } else {
                res.status(500).json(err);
            }
        })
}
// returning on KB
const calculateJsonSize = (json) => {
    return JSON.stringify(json).length / 1024;
}

const insertDataOnFile = (req, res) => {
    const jsonData = req.body;
    filemanager.getData()
        .then(filedata => {
            const finalData = {
                ...filedata,
                updated_at: new Date().getTime(),
                config: {
                    ...filedata.config,
                    current_size: calculateJsonSize(jsonData)
                },
                data: jsonData
            }
            if (finalData.config.current_size > finalData.config.max_size) {
                res.status(500).json({
                    message: 'File is full'
                });
            }
            filemanager.insertData(finalData)
                .then(data1 => {
                    res.status(200).json(data1);
                })
                .catch(err => {
                    res.status(500).json(err);
                })
        })
        .catch(err => {
            res.status(500).json(err);
        })
}

const createRealtimeDatabase = (req, res) => {
    filemanager.createRealtimeDatabase()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}

module.exports = {
    insertDataOnFile,
    getDataOnFile,
    createRealtimeDatabase,
    create,
    getData,
    setData
}
