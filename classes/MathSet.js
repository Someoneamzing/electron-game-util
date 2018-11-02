class MathSet extends Set{
  constructor(base){
    super(base);
  }

  union(a){
    return new MathSet(a.values().concat(this.values()));
  }

  intersection(a){
    let res = new MathSet();
    if (a.length < this.length){
      for (let i of a) {
        if (this.has(i)) res.add(i);
      }
      return res;
    } else {
      for (let i of this) {
        if (a.has(i)) res.add(i);
      }
      return res;
    }
  }

  exclusion(a){
    let res = new MathSet(this.values());
    for (let i in a) {
      res.delete(a);
    }

    return res;
  }
}

module.exports = MathSet;
