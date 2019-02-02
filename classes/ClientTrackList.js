const ConnectionManager = require("./ConnectionManager.js");
const EventEmitter = require('events');

module.exports = class ClientTrackList extends EventEmitter {
  constructor(){
    super();
    this.type = null;
    this.list = {};
  }

  setType(type){
    this.type = type;
  }

  add(obj){
    this.list[obj.netID] = obj;
    //console.log(this.new);
    //this.initPack.push(obj.getInitPkt());
  }

  update(){
    for(let id in this.list){
      this.list[id].update(this.type.name);
    }
  }

  remove(obj){
    delete this.list[obj.netID];
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

  setup(...rest){
    this.type.setup(...rest);
  }
}
