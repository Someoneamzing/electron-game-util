exports = class ConnectionManager {
  constructor(side,server){
    this.side = side;
    this.server = server;
    this.lists = {};

    if (this.side == ConnectionManager.CLIENT) {
      this.server.on('connectionmanager-init', this.init.bind(this));
      this.server.on('connectionmanager-update', this.update.bind(this));
      this.server.on('connectionmanager-remove', this.remove.bind(this));
    }
  }

  addTrackList(list){
    this.lists.push(list);
  }

  init(pack){
    switch(this.side){
      case ConnectionManager.SERVER:
        let packet = {};
        for(let type in this.lists){
          let list = this.lists[type];
          packet[list.type.name] = list.getInitPack();
        }
        this.server.send('connectionmanager-init', packet);
        break;

      case ConnectionManager.CLIENT:
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
          packet[list.type.name] = list.getUpdatePack();
        }
        this.server.send('connectionmanager-update', packet);
        break;

      case ConnectionManager.CLIENT:
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
          packet[list.type.name] = list.getRemovePack();
        }
        this.server.send('connectionmanager-remove', packet);
        break;
      case ConnectionManager.CLIENT:
        for(let type in pack){
          let list = this.lists[type];
          list.parseRemovePack(pack[type]);
        }
        break;
    }
  }


}

Object.defineProperty(ConnectionManager,'CLIENT',{
  value: 1,
  writable: false;
})

Object.defineProperty(ConnectionManager,'SERVER',{
  value: 0,
  writable: false;
})
