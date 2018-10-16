const ConnectionManager = require("./ConnectionManager.js");
const EventEmitter = require('events');

module.exports = class TrackList extends EventEmitter {
  constructor(side, share = true){
    super();
    this.type = null;
    this.side = side;
    this.list = {};
    this.new = [];
    this.share = share;
    this.removePack = [];
    this.missing = {};
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
      if (this.missing[p.netID]) {
        clearTimeout(this.missing[p.netID]);
        console.log("Recieved init pack for object " + p.netID + ". Removing timeout.")
      }
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
      if (this.list[p.netID]){
        this.list[p.netID].update(p);
      } else {
        console.warn("Got update for unknown object with id of " + p.netID + ". Marking for tests. If no init is recieved after 2000ms will assume packet loss has ocurred.")
        if (!this.missing[p.netID]) this.missing[p.netID] = setTimeout(()=>{
          delete this.missing[p.netID]
          this.emit('error', {cause:"missing-obj-update", message:"Recieved an update packet for an unknown object without receiving an init pack within 2000ms"})
        }, 2000);
      }
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
