const ConnectionManager = require("./ConnectionManager.js");

module.exports = class TrackList {
  constructor(side, share = true){
    this.type = null;
    this.side = side;
    this.list = {};
    this.new = [];
    this.share = share;
    this.removePack = [];
  }

  setType(type){
    this.type = type;
  }

  add(obj){
    this.list[obj.netID] = obj;
    if (this.side == ConnectionManager.SERVER) this.new.push(obj.netID);
    //console.log(this.new);
    //this.initPack.push(obj.getInitPkt());
  }

  parseInitPack(pack){
    for(let p of pack){
      let o = new this.type(p);
      //console.log(o);
    }
  }

  update(){
    for(let id in this.list){
      this.list[id].update(this.type.name);
    }
  }

  parseUpdatePack(pack){
    //console.log(pack);
    for(let p of pack){
      this.list[p.netID].update(p);
    }
  }

  parseRemovePack(pack){
    //console.log(pack);
    for(let id of pack){
      this.list[id].remove();
    }
  }

  remove(obj){
    if (this.side == ConnectionManager.SERVER){this.removePack.push(obj.netID);}
    delete this.list[obj.netID];
  }

  getAllInitPack(){
    let pack = [];
    for(let id in this.list){
      pack.push(this.list[id].getInitPkt())
    }
    return pack;
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
    let pack = this.removePack.concat([]);
    //console.log(pack);
    this.removePack.length = 0;
    return pack;
  }

  get(netID){
    return this.list[netID];
  }

  getIds(){
    return Object.keys(this.list);
  }

  run(prop, ...rest){
    for(let id in this.list){
      if (prop in this.list[id]) this.list[id][prop](...rest);
    }
  }
}
