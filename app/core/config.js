module.exports = {

    name: "JSON DB",
    version: "0.0.1",
    port: 3333,
    engine:{
        coreDb: __dirname + '/db.json'
    }

}