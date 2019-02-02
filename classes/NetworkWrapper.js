const GameObject = require('./GameObject.js');
const uuid = require('uuid/v4');
let NetworkWrapper = (Base, tracklist) => {
  console.log(tracklist);
  let made = (class extends GameObject(Base, tracklist) {
    constructor(opts, ...rest){

      super(opts, ...rest);


    }
    //
    // remove(){
    //   if ('remove' in Base.prototype) {super.remove()};
    //
    //   Tracklist.remove(this);
    // }

    getInitPkt(){
      let pack = {};
      if ('getInitPkt' in Base.prototype) {pack = super.getInitPkt()};
      pack.netID = this.netID;
      return pack;
    }

    getUpdatePkt(){
      let pack = {};
      if ('getUpdatePkt' in Base.prototype) {pack = super.getUpdatePkt()};
      pack.netID = this.netID;
      return pack;
    }
    //
    // update(...params){
    //   if ('update' in Base.prototype) {super.update(...params)};
    // }
  })


  made.isNetWrapped = true;

  return made;
}

module.exports = NetworkWrapper;
