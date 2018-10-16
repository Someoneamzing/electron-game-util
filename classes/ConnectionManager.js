const EventEmitter = require('events');

class ConnectionManager extends EventEmitter {
  constructor(side,server){
    super();
    this.side = side;
    this.server = server;
    this.lists = {};

    if(this.side == ConnectionManager.SERVER){
      this.connections = {};
      this.server.on('connection', (socket)=>{
        this.connections[socket.id] = {socket, controls: null};
        markTime('controlinterface-init', 'once');
        socket.once('controlinterface-init', (pack)=>{
          //console.log("Connectred to new ControlInterface");
          this.connections[socket.id].controls = pack;
          markTime('controlinterface-key-update', 'on');
          socket.on('controlinterface-key-update', (pack)=>{
            //console.log("Received update from a ControlInterface");
            this.connections[socket.id].controls = pack;
          })
        })
        markTime('connectionmanager-connect', 'on');
        socket.on('connectionmanager-connect', ()=>{
          this.firstInit(socket);
          socket.join('connectionmanager-clients');

        })
        markTime('disconnect', 'on');
        socket.on('disconnect', (e)=>{
          delete this.connections[socket.id];
        })
      });
    }
  }

  connect(){
    if (this.side == ConnectionManager.CLIENT) {
      this.server.on('connectionmanager-init', this.init.bind(this));
      this.server.on('connectionmanager-update', this.update.bind(this));
      this.server.on('connectionmanager-remove', this.remove.bind(this));
      this.server.send('connectionmanager-connect');

    }
  }

  addTrackList(list){
    this.lists[list.type.name] = list;
    list.on('error', (err)=>this.emit('error', err));
  }

  firstInit(socket){
    console.log("Sending first init packet with everything on the server.");
    let packet = {};
    for(let type in this.lists){
      let list = this.lists[type];
      if (list.share) packet[list.type.name] = list.getAllInitPack();
    }
    //console.log(packet);
    markTime('connectionmanager-init', 'emit');
    socket.emit('connectionmanager-init', packet);
  }

  init(pack){
    switch(this.side){
      case ConnectionManager.SERVER:
        let packet = {};
        for(let type in this.lists){
          let list = this.lists[type];
          if (list.share) packet[list.type.name] = list.getInitPack();
        }
        //console.log(packet);
        this.server.io.to('connectionmanager-clients').emit('connectionmanager-init', packet);
        break;

      case ConnectionManager.CLIENT:
        //console.log("Got init pack from server.");
        for(let type in pack){
          let list = this.lists[type];
          list.parseInitPack(pack[type]);
        }
        break;
    }
  }

  update(pack){
    switch(this.side){
      case ConnectionManager.SERVER:
        let packet = {};
        for(let type in this.lists){
          let list = this.lists[type]
          list.update()
          if (list.share) packet[list.type.name] = list.getUpdatePack();
        }
        this.server.io.to('connectionmanager-clients').emit('connectionmanager-update', packet);
        break;

      case ConnectionManager.CLIENT:
        //console.log("Got update pack from server.");
        for(let type in pack){
          let list = this.lists[type];
          list.parseUpdatePack(pack[type]);
        }
        break;
    }
  }

  remove(pack){
    switch(this.side){
      case ConnectionManager.SERVER:
        let packet = {};
        for(let type in this.lists){
          let list = this.lists[type];
          if (list.share) packet[list.type.name] = list.getRemovePack();
        }
        this.server.io.to('connectionmanager-clients').emit('connectionmanager-remove', packet);
        break;
      case ConnectionManager.CLIENT:
        //console.log("Got remove pack from server.");
        for(let type in pack){
          let list = this.lists[type];
          list.parseRemovePack(pack[type]);
        }
        break;
    }
  }


}

module.exports = ConnectionManager;

Object.defineProperty(ConnectionManager,'CLIENT',{
  value: 1,
  writable: false
})

Object.defineProperty(ConnectionManager,'SERVER',{
  value: 0,
  writable: false
})
