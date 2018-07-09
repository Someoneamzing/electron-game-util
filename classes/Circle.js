const Point = require('./Point.js');
const Rectangle = require('./Rectangle.js');

exports = class Circle extends Point {
  constructor(x,y,r){
    super(x,y);
    this.r = r;
  }

  intersects(other) {
    if (other instanceof Circle) {
      let dist = this.distance2(other);
      return dist <= this.r ** 2 + other.r ** 2;
    } else if (other instanceof Rectangle) {
      return other.nearestInBounds(this).distance2(this) < this.r ** 2;
    } else if (other instanceof Point){
      return this.contains(other);
    }
  }

  contains(other) {
    if (other instanceof Rectangle) {
      return (this.contains(new Point(other.x - other.w/2, other.y - other.h/2)) && this.contains(new Point(other.x - other.w/2, other.y + other.h/2)) && this.contains(new Point(other.x + other.w/2, other.y - other.h/2)) && this.contains(new Point(other.x + other.w/2, other.y + other.h/2)));
    } else if (other instanceof Circle) {
      return this.distance2(other) + other.r ** 2 < this.r ** 2;
    } else if (other instanceof Point) {
      return this.distance2(other) < this.r ** 2;
    } else {
      console.log("Circle: contains(multi::query) expects either a Rectangle, Circle or Point class instance. Got '" + other.constructor.name + "'." );
    }
  }

  randomWithin(){
    let a = Math.random() * 2 * Math.PI;
    let dist = Math.random() * this.r;
    return new Point(Math.cos(a) * dist + this.x, Math.sin(a) * dist + this.y);
  }

  show(gc){
    gc.strokeStyle = "#FCC";
    gc.lineWidth = 1;
    gc.beginPath();
    gc.arc(this.x,this.y,this.r,0,2 * Math.PI);
    gc.stroke();
  }
}
