var express = require('express'),
    server  = express(),
    baucis  = require('baucis'),
    Todo    = require('./server/models/todo');

var bodyParser = require('body-parser');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

var todoController = baucis.rest('Todo');
server.use('/api', baucis());

server.listen(process.env.PORT || 3000);
module.exports = server;
