const fs = require('fs');
const path = require('path');

const data_file = path.join(__dirname, './data/file1.json');

const getData = (filename = data_file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        })
    })
}

const insertData = (data, filename = data_file) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

const createFileIfNotExist = (filename = data_file) => {
    return new Promise((resolve, reject) => {
        fs.open(filename, 'wx', (err, fd) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}
const createRealtimeDatabase = (filename = data_file) => {
    return new Promise((resolve, reject) => {
        createFileIfNotExist(filename)
            .then(() => {
                insertData({}).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    getData,
    insertData,
    createFileIfNotExist,
    createRealtimeDatabase
}