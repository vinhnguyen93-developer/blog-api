const fs = require("fs");
const path = require("path");

const init = function (dirPath = __dirname) {
    var modules = fs.readdirSync(dirPath);
    for (let index = 0; index < modules.length; index++) {
        var module = modules[index];
        if (module != "index.js") {
            module = require(path.join(dirPath, module));
        }
    }
}

module.exports = {
    init
}