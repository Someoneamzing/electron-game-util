const Point = require("./Point.js");

module.exports = class Vector extends Point {
  constructor(x,y){
    super(x,y);
  }

  mult(one,two){
    if (one instanceof Vector) {
      return new Vector(this.x * one.x, this.y * one.y);
    } else {
      if (!isNaN(Number(one)) && !isNaN(Number(two))) {
        return new Vector(this.x * one, this.y * two);
      } else {
        throw new Error("Vector: Vector::mult(one, two) expects either typeof 'one' to be Vector or 'one' and 'two' to be convertable to numbers. The supplied values were of type (one, two): (" + one.constructor.name + ", " + two.constructor.name + ").")
      }
    }
  }

  add(one, two){
    if (one instanceof Vector) {
      return new Vector(this.x + one.x, this.y + one.y);
    } else {
      if (!isNaN(Number(one)) && !isNaN(Number(two))) {
        return new Vector(this.x + one, this.y + two);
      } else {
        throw new Error("Vector: Vector::add(one, two) expects either typeof 'one' to be Vector or 'one' and 'two' to be convertable to numbers. The supplied values were were of type (one, two): (" + one.constructor.name + ", " + two.constructor.name + ").")
      }
    }
  }

  sub(one, two) {
    if (one instanceof Vector) {
      return new Vector(this.x - one.x, this.y - one.y);
    } else {
      if (!isNaN(Number(one)) && !isNaN(Number(two))) {
        return new Vector(this.x - one, this.y - two);
      } else {
        throw new Error("Vector: Vector::sub(one, two) expects either typeof 'one' to be Vector or 'one' and 'two' to be convertable to numbers. The supplied values were were of type (one, two): (" + one.constructor.name + ", " + two.constructor.name + ").")
      }
    }
  }

  norm(){
    let len = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2))
    return new Vector(this.x / len, this.y / len);
  }
}
