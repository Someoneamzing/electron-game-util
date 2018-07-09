const ConnectionManager = require("./ConnectionManager.js");

exports = class TrackList {
  constructor(type, side){
    this.type = type;
    this.side = side;
    this.list = {};
    this.new = [];
    this.removePack = [];
  }

  add(obj){
    this.list[obj.netID] = obj;
    if (this.side = ConnectionManager.SERVER) this.new.push(obj.netID);
    //this.initPack.push(obj.getInitPkt());
  }

  parseInitPack(pack){
    for(let p of pack){
      new this.type(pack);
    }
  }

  update(){
    for(let id in this.list){
      this.list[id].update();
    }
  }

  parseUpdatePack(pack){
    for(let p of pack){
      this.list[p.netID].update(p);
    }
  }

  parseRemovePack(pack){
    for(let id of pack){
      this.list[id].remove();
    }
  }

  remove(obj){
    delete this.list[obj.netID];
    if (this.side = ConnectionManager.SERVER) this.removePack.push(obj.netID);
  }

  getAllInitPack(){
    let pack = [];
    for(let id in this.list){
      pack.push(this.list[id].getInitPkt())
    }
  }

  getInitPack(){
    let pack = [];
    for(let id of this.new){
      pack.push(this.list[id].getInitPkt());
    }
    this.new.length = 0;
    return pack;
  }

  getUpdatePack(){
    let pack = [];
    for(let id in this.list){
      pack.push(this.list[id].getUpdatePkt());
    }
    return pack;
  }

  getRemovePack(){
    let pack = this.removePack;
    this.removePack = [];
    return pack;
  }
}
