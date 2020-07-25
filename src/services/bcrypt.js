const bcrypt = require('bcrypt');

module.exports.genSalt = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    })
}

module.exports.compare = function (password, hashPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err) => {
            if (err) {
                reject(err);
            };
            resolve(true);
        })
    })
}