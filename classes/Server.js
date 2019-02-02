const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const ConnectionManager = require('./ConnectionManager.js');


module.exports = class Server {
  constructor(port){
    this.port = port;
    this.app = express();
    this.side = ConnectionManager.SERVER;
    this.server = http.Server(this.app);
    this.io = socketIO(this.server);

  }

  on(event, f){
    this.io.on(event,f);
  }

  send(event, data, socketID){
    this.io.emit(event, data);
  }

  begin(){
    this.server.listen(this.port);
  }
}
