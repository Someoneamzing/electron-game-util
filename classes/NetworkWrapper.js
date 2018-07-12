const uuid = require('uuid/v4');
let NetworkWrapper = (Base, Tracklist) => {if ('netID' in Base.prototype) {throw new Error("NetworkWrapper: NetworkWrapper cannot be used to wrap itself or another Pre-Wrapped class.")} else {
  let made = (class extends Base {
      constructor(opts, ...rest){
        console.log(opts, ...rest);
        if (Base.isNetWrapped){
          console.log('Wrapped');
          super(opts, ...rest);
        } else {
          super(...rest)
        }

        if (!this.netID) this.netID = (opts && typeof opts.netID !== 'undefined')? opts.netID : uuid();


        Tracklist.add(this);
      }

      remove(){
        if ('remove' in Base.prototype) {super.remove()};

        Tracklist.remove(this);
      }

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

      update(...params){
        if ('update' in Base.prototype) {super.update(...params)};
      }
    })


    made.isNetWrapped = true;

    return made;
  }
}

module.exports = NetworkWrapper;
