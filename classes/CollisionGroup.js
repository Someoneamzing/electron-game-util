let CollisionGroup = (Base, name) => {
  return class extends Base {
    constructor(...rest){
      super(...rest);
      this.collisionGroups = (this.collisionGroups?this.collisionGroups.concat([name]):[name]);
    }
  }
}

module.exports = CollisionGroup;
