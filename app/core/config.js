module.exports = {

    name: "JSON DB",
    version: "0.0.1",
    port: 3333,
    engine: {
        coreUser: 'root',
        coreDbName: 'core',
        dataDir: __dirname + '/../data',
        pathSeparator: '/'
    }

}