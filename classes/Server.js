const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

module.exports = class Server {
  constructor(port){
    this.port = port;
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socketIO(this.server);

  }

  on(event, f){
    this.io.on(event,f);
  }

  send(event, data){
    this.io.emit(event, data);
  }

  begin(){
    this.server.listen(this.port);
  }
}