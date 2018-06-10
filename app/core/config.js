module.exports = {

    name: "JSON DB",
    version: "0.0.1",
    port: 3333,
    rootDir: __dirname + '/../',
    engine: {
        coreUser: 'root',
        coreDbName: 'core',
        dataDir: __dirname + '/../data',
        pathSeparator: '/'
    },
    jwtSecret: 'sdjflksjdfljsdlf'

}