const uuid = require('uuid/v4');
exports = NetworkWrapper = (Base, Tracklist) => {if ('netID' in Base.prototype) {throw new Error("NetworkWrapper: NetworkWrapper cannot be used to wrap itself or another Pre-Wrapped class.")} else return class extends Base {
    constructor(opts, ...rest){
      super.apply([opts].concat(rest));

      this.netID = typeof opts.netID !== 'undefined' ? opts.netID : uuid();


      Tracklist.add(this);
    }

    remove(){
      if ('remove' in super) {super.remove()};
      Tracklist.remove(this);
    }

    getInitPkt(){
      return {
        netID: this.netID
      }
    }
  }
}
