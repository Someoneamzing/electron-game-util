const Point = require('./Point.js');
const {clamp, sum, average} = require('./MathUtil.js');

class Rectangle extends Point {
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
    } else if (point instanceof Line) {
      return this.contains(point.a) && this.contains(point.b);
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
    } else if (rect instanceof Line){
      return rect.intersects(this);
    }
  }

  nearestInBounds(point) {
    return new Point(clamp(point.x,this.x - this.w/2,this.x + this.w/2), clamp(point.y, this.y - this.h/2, this.y + this.h/2));
  }

  randomWithin(){
    return new Point(Math.random() * this.w - this.w/2 + this.x, Math.random() * this.h - this.h/2 + this.y);
  }

  show(gc){
    gc.stroke("#0f0");
    gc.noFill();
    gc.ctx.lineWidth = 1;
    gc.rect(this.x, this.y, this.w, this.h);
  }

  highlight(gc){
    gc.noStroke();
    gc.fill(0, 255, 0, 0.3);
    gc.ctx.lineWidth = 1;
    gc.rect(this.x, this.y, this.w, this.h);
  }
}

class Circle extends Point {
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
    } else if (other instanceof Line){
      return other.intersects(this);
    }
  }

  contains(other) {
    if (other instanceof Rectangle) {
      return (this.contains(new Point(other.x - other.w/2, other.y - other.h/2)) && this.contains(new Point(other.x - other.w/2, other.y + other.h/2)) && this.contains(new Point(other.x + other.w/2, other.y - other.h/2)) && this.contains(new Point(other.x + other.w/2, other.y + other.h/2)));
    } else if (other instanceof Circle) {
      return this.distance2(other) + other.r ** 2 < this.r ** 2;
    } else if (other instanceof Point) {
      return this.distance2(other) < this.r ** 2;
    } else if (other instanceof Line) {
      return this.contains(other.a) && this.contains(other.b);
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
    gc.stroke("#FCC");
    gc.noFill();
    gc.ctx.lineWidth = 1;
    gc.circle(this.x,this.y,this.r);
  }
}

class Line {
  constructor(a, b, c, d){
    if (a instanceof Point){
      this.a = a;
      this.b = b;
    } else {
      this.a = new Point(a,b);
      this.b = new Point(c,d);
    }
  }

  nearestOn(p){
    let {x: e, y: f} = p;
    let {x: c, y: a} = this.a;
    let {x: d, y: b} = this.b;
    let x = ((a ** 2) * d - a * (b * (c + d) - (c - d) * f) + (b ** 2) * c - b * (c - d) * f + ((c - d) ** 2) * e)/((a ** 2) - 2 * b + (b ** 2) + ((c - d) ** 2));
    let y = ((a - b)/(c - d)) * (x - c) + a;
    return new Point(clamp(x, Math.min(c,d), Math.max(c,d)),clamp(y, Math.min(a,b), Math.max(a,b)));
  }

  show(gc){
    gc.stroke('black');
    gc.line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  contains(p){
    if (p instanceof Point){
      return (this.a.x <= Math.max(p.x, this.b.x) && this.a.x >= Math.min(p.x, this.b.x) && this.a.y <= Math.max(p.y, this.b.y) && this.a.y >= Math.min(p.y, this.b.y));
    }
  }

  intersects(other){
    if(other instanceof Rectangle){
      let left = other.x - other.w/2;
      let top = other.y - other.h/2;
      let right = other.x + other.w/2;
      let bottom = other.y + other.h/2;
      return (this.intersects(new Line(left, top, right, top)) || this.intersects(new Line(left, bottom, right, bottom)) || this.intersects(new Line(left, top, left, bottom)) || this.intersects(new Line(right, top, right, bottom)) || other.contains(this));
    } else if (other instanceof Circle){
      return other.contains(this.nearestOn(other));
    } else if (other instanceof Line){
      let o1 = Point.orient(this.a, this.b, other.a);
      let o2 = Point.orient(this.a, this.b, other.b);
      let o3 = Point.orient(other.a, other.b, this.a);
      let o4 = Point.orient(other.a, other.b, this.b);

      if (o1 != o2 && o3 != o4) return true;
      if (o1 == 0 && (new Line(other.a, this.b)).contains(this.a)) return true;
      if (o2 == 0 && (new Line(other.b, this.b)).contains(this.a)) return true;
      if (o3 == 0 && (new Line(this.a, other.b)).contains(other.a)) return true;
      if (o4 == 0 && (new Line(this.b, other.b)).contains(other.a)) return true;

      return false;
    } else if (other instanceof Point) return this.contains(other);
  }
}


module.exports = {Rectangle, Circle, Line};
