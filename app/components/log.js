module.exports = {

    console: function (data, callback) {
        
        console.log(data)
        if(typeof callback == 'function'){
            callback()
        }

    }    

}