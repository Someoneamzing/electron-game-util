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
      } else if (!isNaN(Number(one))){
        return new Vector(this.x * one, this.y * one);
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

  angleBetween(b){
    return this.dot(b) / (this.len() * b.len());
  }

  dot(b) {
    return this.x * b.x + this.y * b.y;
  }

  sub(one, two) {
    if (one instanceof Vector || one instanceof Point) {
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
    let len = this.len();
    return new Vector(this.x / len, this.y / len);
  }

  len(){
    return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
  }
}
