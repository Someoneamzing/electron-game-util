const io = require('socket.io-client');

module.exports = class Client {
  constructor(ip, port){
    this.ip = ip;
    this.port = port;
    this.socket = io(ip + ":" + port, {autoConnect: false});
  }

  on(event, f){
    this.socket.on(event, f);
  }

  send(event, ...data){
    this.socket.emit(event, ...data);
  }

  connect(){
    this.socket.connect();
  }
}
