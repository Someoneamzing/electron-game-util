const Point = require('./Point.js');
const Circle = require('./Circle.js');

module.exports = class Rectangle extends Point {
  constructor(x,y,w,h) {
    super(x,y);
    this.w = w;
    this.h = h;
  }

  contains(point){
    if (point instanceof Rectangle) {
      return this.contains(new Point(point.x - point.w/2, point.y - point.h/2)) &&
             this.contains(new Point(point.x - point.w/2, point.y + point.h/2)) &&
             this.contains(new Point(point.x + point.w/2, point.y - point.h/2)) &&
             this.contains(new Point(point.x + point.w/2, point.y + point.h/2));
    } else if (point instanceof Circle) {
      return (this.x - this.w/2 < point.x - point.r &&
              this.x + this.w/2 > point.x + point.r &&
              this.y - this.h/2 < point.y - point.r &&
              this.y + this.h/2 > point.y + point.r);
    } else if (point instanceof Point) {
      if (this.x - this.w/2 > point.x || this.x + this.w/2 < point.x) return false;
      if (this.y - this.h/2 > point.y || this.y + this.h/2 < point.y) return false;
      return true;
    }
  }

  intersects(rect){
    if (rect instanceof Rectangle){
      if (this.x - this.w/2 > rect.x + rect.w/2 || this.x + this.w/2 < rect.x - rect.w/2) return false;
      if (this.y - this.h/2 > rect.y + rect.h/2 || this.y + this.h/2 < rect.y - rect.h/2) return false;
      return true;
    } else if (rect instanceof Circle) {
      let nearest = this.nearestInBounds(rect);
      //console.log(nearest);
      return nearest.distance2(rect) < rect.r ** 2;
    } else if (rect instanceof Point){
      return this.contains(rect);
    }
  }

  nearestInBounds(point) {
    return new Point(clamp(point.x,this.x - this.w/2,this.x + this.w/2), clamp(point.y, this.y - this.h/2, this.y + this.h/2));
  }

  randomWithin(){
    return new Point(Math.random() * this.w - this.w/2 + this.x, Math.random() * this.h - this.h/2 + this.y);
  }

  show(gc){
    gc.strokeStyle = "#0f0";
    gc.lineWidth = 1;
    gc.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }
}
