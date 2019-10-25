const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const BodyParser    = require('body-parser');
const app           = express();
const route         = require("./app/routes.js");

const port = 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'warehouse';

app.use(BodyParser.urlencoded({ extended: true }));

MongoClient.connect(url, function(err, database) {
    if(!err) {
        console.log("DB is connected");
    }
    const db = database.db(dbName);
    route(app, db);
    app.listen(port, () =>{
        console.log('hello: ' + port);
    });
});







