'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

var urldb = 'mongodb://localhost:27017/soundic';

mongoose.connect(urldb);
let cnndb = mongoose.connection;

cnndb.once('open', function() {
    console.log("conectado");
    app.listen(port, function(){
       console.log('Servidor api rest escuchando http://localhost:' + port) ;
    });
});

cnndb.on('error', console.error.bind(console, 'connection error:'));

/*mongoose.createConnection(urldb, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("conectado");
        app.listen(port, function(){
           console.log('Servidor api rest escuchando http://localhost:' + port) ;
        });
    }
});*/