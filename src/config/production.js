module.exports = {
    app: {
        port: 8899,
        morganEnable: true,
        corsMode: "all",
        authHeaderKey: "authorization"
    },
    api: {
        pagination: {
            index: {
                field: "pageIndex",
                default: 0,
                min: 0,
            },
            size: {
                field: "pageSize",
                default: 20,
                min: 1,
                max: 50
            }
        },
    },
    storage: {
        rootPath: "/upload",
        isRelativePath: true,
        limit: 15, // MB
        groupPath: {
            image: "/image",
            common: "/common",
            temp: "/temp"
        },
        bodyField: "file",
        multiSupport: false,
        mimeGroup: {
            image: [
                "image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/bmp",
            ],
            common: [
                "text/plain",
            ]
        },
        cacheOptions: {
            enable: true,
            options: {
                "max-age": 3600
            }
        }
    },
    database: {
        mongo: {
            uri: "mongodb://vcteam2020:vcteam2020gialy17061998@207.148.69.27:27017/?authSource=admin",
            options: {
                useNewUrlParser: true, useUnifiedTopology: true,
            }
        },
    }
}