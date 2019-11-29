const GameObject = require('./GameObject.js');
const ConnectionManager = require('./ConnectionManager.js');
const uuid = require('uuid/v4');
let NetworkWrapper = (Base, tracklist, netProps = []) => {
  console.log(tracklist);
  let customDeserial = new Set();
  netProps = netProps.map(e=>{
    if (e.startsWith("*")) {
      customDeserial.add(e.substring(1))
      return e.substring(1);
    } else return e;
  })
  let made = (class extends GameObject(Base, tracklist) {
    constructor(opts, ...rest){

      super(opts, ...rest);
      if (typeof this.dirtyProps == 'undefined') {
        this.dirtyProps = {};
      }
      for (let prop of netProps) {
        this[made.netPropMap.get(prop)] = (this[made.netPropMap.get(prop)] !== null && this[made.netPropMap.get(prop)] !== undefined?this[made.netPropMap.get(prop)]:null);
        this.dirtyProps[prop] = true;
      }

    }

    // remove(){
    //   if ('remove' in Base.prototype) {super.remove()};
    //
    //   if (this[TrackList.topTrackSymbol] === tracklist) GUI
    // }

    getInitPkt(){
      let pack = {netID: this.netID};
      if ('getInitPkt' in Base.prototype) {pack = super.getInitPkt()};
      for (let prop of netProps) {
        pack[prop] = this[prop];
      }
      return pack;
    }

    getUpdatePkt(){
      let pack = {netID: this.netID};
      if ('getUpdatePkt' in Base.prototype) {pack = super.getUpdatePkt()};
      for (let prop of netProps) {
        if (this.dirtyProps[prop]) {
          pack[prop] = this[prop];
          delete this.dirtyProps[prop];
        }
      }
      return pack;
    }

    deserialise(prop, val){
      return val;
    }
    //
    update(pack, ...params){
      if ('update' in Base.prototype) {
        super.update(pack, ...params)
      } else if (tracklist.side == ConnectionManager.CLIENT) {
        for (let prop in pack) {
          if (prop == 'netID') continue;
          if (customDeserial.has(prop)) {
            this[prop] = this.deserialise(prop, pack[prop]);
          } else this[prop] = pack[prop];
        }
      }
    }

    isDirty(){
      return Object.keys(this.dirtyProps).length > 0 || (typeof super.isDirty == "function"?super.isDirty():false);
    }

    static getNetProps(){
      return super.getNetProps?netProps.concat(super.getNetProps()):netProps;
    }

    static getFinalProp(prop){
      return made.netPropMap.has(prop)?made.netPropMap.get(prop):(super.getFinalProp?super.getFinalProp(prop):null);
    }

  })

  made.netPropMap = new Map();

  for (let prop of netProps) {

    let id = uuid();

    made.netPropMap.set(prop, id);

    Object.defineProperty(made.prototype, prop, {
      get: function (){
        return this[id];
      },
      set: function(val){
        this[id] = val;
        if (typeof this.dirtyProps != 'undefined' && !this.dirtyProps[prop]) this.dirtyProps[prop] = true;
      }
    })
  }


  made.isNetWrapped = true;

  return made;
}

module.exports = NetworkWrapper;
