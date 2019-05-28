const GameObject = require('./GameObject.js');
const ConnectionManager = require('./ConnectionManager.js');
const uuid = require('uuid/v4');
let NetworkWrapper = (Base, tracklist, netProps = []) => {
  console.log(tracklist);
  let made = (class extends GameObject(Base, tracklist) {
    constructor(opts, ...rest){

      super(opts, ...rest);
      if (typeof this.dirtyProps == 'undefined') {
        this.dirtyProps = {};
      }
      for (let prop of netProps) {
        this.dirtyProps[prop] = true;
      }

    }

    // remove(){
    //   if ('remove' in Base.prototype) {super.remove()};
    //
    //   Tracklist.remove(this);
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
          this.dirtyProps[prop] = false;
        }
      }
      return pack;
    }
    //
    update(pack, ...params){
      if ('update' in Base.prototype) {
        super.update(pack, ...params)
      } else if (tracklist.side == ConnectionManager.CLIENT) {
        for (let prop in pack) {
          if (prop == 'netID') continue;
          this[prop] = pack[prop];
        }
      }
    }
  })

  for (let prop of netProps) {

    let id = uuid();

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
