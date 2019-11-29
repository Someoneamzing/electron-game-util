const EventEmitter = require('events');

class ClientManager extends EventEmitter {
  constructor(){
    super();
    this.lists = {};
  }

  addTrackList(list){
    this.lists[list.type.name] = list;
    list.on('error', (err)=>this.emit('error', err));
  }

  update(pack){
    for(let type in this.lists){
      let list = this.lists[type]
      list.update()
    }
  }

  serialiseLists(){
    let packet = {};
    for(let type in this.lists){
      let list = this.lists[type];
      if (list.shouldSave) packet[list.type.name] = list.getAllInitPack();
    }
    return JSON.stringify(pack);
  }

  deserialise(data){
    let pack = JSON.parse(data);
    for(let type in pack){
      let list = this.lists[type];
      list.parseInitPack(pack[type]);
    }
  }

  setup(...rest){
    for (let type in this.lists){
      let list = this.lists[type];
      list.setup(...rest);
    }
  }

  getClassByName(name){
    return this.lists[name]?this.lists[name].type:Object;
  }
}

module.exports = ClientManager;
