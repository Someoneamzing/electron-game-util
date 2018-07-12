let CollisionGroup = (Base, name) => {
  return class extends Base {
    constructor(...rest){
      super(...rest);
      this.collisonGroups = (this.collisonGroups?this.collisonGroups.push(name):[name]);
    }
  }
}

module.exports = CollisionGroup;
