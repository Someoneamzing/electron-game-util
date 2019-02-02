const uuid = require('uuid/v4');

const EventEmitter = require('events');

function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

let GameObject = (Base, tracklist) => {
  let made = (class extends Base {
    constructor(opts, ...rest){
      if (Base.isNetWrapped||Base.isGameObject){
        super(opts, ...rest);
      } else {
        super(...rest);
      }
      EventEmitter.call(this);

      if (!this.netID) {

        this.netID = (opts && typeof opts.netID !== 'undefined')? opts.netID : uuid();
      }


      tracklist.add(this);
    }

    remove(){
      if ('remove' in Base.prototype) {super.remove()};

      tracklist.remove(this);
    }

    update(...params){
      if ('update' in Base.prototype) {super.update(...params)};
    }

    static setup(...rest){
      if ("setup" in Base){
        Base.setup(...rest);
      }
    }
  })


  made.isGameObject = true;

  completeAssign(made.prototype, EventEmitter.prototype);

  made.prototype.constructor = made;

  return made;
}

module.exports = GameObject;
