const controller = require('./controller');
const filemanager = require('../filemanager');
const config = require('./config');


const calculateJsonSize = (json) => {
    return JSON.stringify(json).length / 1024;
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


controller.listenData(config.server_topic_name, (message) => {
    if (!isJsonString(message.value)) {
        return
    }
    const jsonData = JSON.parse(message.value);
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
            filemanager.insertData(finalData)
                .then(data1 => {
                    controller.sendData(config.client_topic_name, JSON.stringify(data1.data));
                })
                .catch(err => {
                    throw err;
                })
        })
        .catch(err => {
            throw err;
        })
});

