const fs = require("fs");
const { promisify } = require("util");
const imageSize = promisify(require("image-size"));

const fileSystem = {};

fileSystem.existed = (path, { createIfNotExist = false, data, isFolder = false } = {}) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, async (err, info) => {
            if (!info && createIfNotExist) {
                if (isFolder) {
                    fileSystem.createFolder(path);
                    return resolve(true);
                }

                return await fileSystem.createFile(path, data)
                    .then(() => resolve(true))
                    .catch((error) => reject(error))
            }

            resolve(info ? true : false);
        })
    });
}

fileSystem.createFolder = (path) => {
    return fs.mkdirSync(path, { recursive: true });
}

fileSystem.createFile = (path, data, options) => {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(path, options);
        
        writeStream.on("finish", () => {
            resolve(true);
        })

        writeStream.on("error", reject);
        writeStream.write(data);

    });
}

fileSystem.rename = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (error) => {
            if (error) {
                return reject(error);
            }
            return resolve(true);
        })
    })
}

fileSystem.unlink = (path) => {
    return new Promise((cb) => {
        if (!path) cb(false);
        
        fs.unlink(path, (error) => {
            if (error) {
                return cb(false)
            }

            return cb(true);
        })
    })
}

fileSystem.imageInfo = async (filepath) => {
    const { width, height } = await imageSize(filepath);
    
    return {
        width,
        height
    }
}

fileSystem.createStream = (path, typeStream = "read", { triggers = {}, options = {} } = {}) => {
    var operator;
    if (typeStream === "read") {
        operator = fs.createReadStream;
    }
    if (typeStream === "write") {
        operator = fs.createWriteStream;
    }

    if (operator) {
        const stream = operator(path, options);
        for (const event in triggers) {
            const trigger = triggers[event];
            stream.on(event, trigger);
        }

        return stream;
    }
} 

module.exports = fileSystem;