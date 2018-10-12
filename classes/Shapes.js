const Point = require('./Point.js');
const Vector = require('./Vector.js');
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

  get corners() {
    return [new Point(this.x - this.w/2, this.y-this.h/2), new Point(this.x + this.w/2, this.h - this.h/2), new Point(this.x - this.w/2, this.y + this.h/2), new Point(this.x + this.w/2, this.h + this.h/2)]
  }

  get edges(){
    let res = [];
    let c = this.corners;
    res[0] = new Line(c[0], c[1]);
    res[1] = new Line(c[1], c[2]);
    res[2] = new Line(c[2], c[3]);
    res[3] = new Line(c[3], c[0]);
    return res;
  }

  static fromCorners(a,b,c,d) {
    let center = average([new Point(a,b), new Point(c,d)]);
    let w = Math.abs(a - c);
    let h = Math.abs(b - d);
    return new Rectangle(center.x, center.y, w, h);
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
    // let {x: e, y: f} = p;
    // let {x: c, y: a} = this.a;
    // let {x: d, y: b} = this.b;
    // let x = ((a ** 2) * d - a * (b * (c + d) - (c - d) * f) + (b ** 2) * c - b * (c - d) * f + ((c - d) ** 2) * e)/((a ** 2) - 2 * b + (b ** 2) + ((c - d) ** 2));
    // let y = ((a - b)/(c - d)) * (x - c) + a;
    let a = new Vector(p.x - this.a.x, p.y - this.a.y);
    let b = new Vector(this.b.x - this.a.x, this.b.y - this.a.y);
    let norm = b.norm();
    let {x, y} = norm.mult(a.dot(norm)).add(this.a.x, this.a.y);
    return new Point(clamp(x, Math.min(this.a.x,this.b.x), Math.max(this.a.x,this.b.x)),clamp(y, Math.min(this.a.y,this.b.y), Math.max(this.a.y,this.b.y)));
  }

  show(gc){
    gc.stroke('black');
    gc.line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  highlight(gc){
    gc.stroke('lime');
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

  static side(line, p) {
    return Point.orient(p, line.a, line.b);
  }
}

Object.defineProperty(Line, 'ON', {
  value: 2,
  writable: false
})

Object.defineProperty(Line, 'LEFT', {
  value: 1,
  writable: false
})

Object.defineProperty(Line, 'RIGHT', {
  value: 2,
  writable: false
})



class Polygon {
  constructor(...edgeLoops){
    for (let points of edgeLoops) if (points.length < 3 || !(points.every((p)=>{return p instanceof Point}))) throw new Error("Polygon: new Polygon(points, ...) expects all point arrays to be an array of Point objects containing 3 or more elements.");
    this.verts = edgeLoops.reduce((a,points)=>a.concat(points));
    console.log(this.verts);
    this.edges = [];
    this.edgeLoops = [];
    for (let j in edgeLoops){
      let points = edgeLoops[j];
      for (let i = 0; i < points.length - 1; i ++){
        this.edges.push(new Line(points[i], points[i + 1]));
      }
      this.edges.push(new Line(points[points.length-1], points[0]));
      this.edgeLoops[j] = points;
    }

    let bX = {p: null, x: -Infinity};
    let bY = {p: null, y: -Infinity};
    let sX = {p: null, x: Infinity};
    let sY = {p: null, y: Infinity};

    for (let p of this.verts) {
      if (p.x > bX.x) {
        bX = {p, x: p.x};
      }
      if (p.x < sX.x) {
        sX = {p, x: p.x};
      }
      if (p.y > bY.y) {
        bY = {p, y: p.y};
      }
      if (p.y < sY.y) {
        sY = {p, y: p.y};
      }
    }
    this.extremes = {bx: bX.p, sx: sX.p, by: bY.p, sy: sY.p};
    console.log(this.extremes);
    let middle = average(this.verts);
    this._x = middle.x;
    this._y = middle.y;
  }

  set x(a){
    let diffX = a - this._x;
    for (let p of this.verts) {
      p.x += diffX;
    }
    // for(let e of this.edges){
    //   e.a.x += diffX;
    //   e.b.x += diffX;
    // }
    this._x = a;
  }

  set y(a){
    let diffY = a - this._y;
    for (let p of this.verts) {
      p.y += diffY;
    }
    // for(let e of this.edges){
    //   e.a.y += diffY;
    //   e.b.y += diffY;
    // }
    this._y = a;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  area(){
    if (this.edgeLoops.length > 1) throw new Error("Polygon: Cannot calculate area of polygon made of multiple edge loops.");
    let total = 0;
    for (let i = 0; i < this.verts.length; i ++){
      total =+ (this.verts[i].x * this.verts[(i + 1) % this.verts.length].y) - (this.verts[i].y * this.verts[(i + 1) % this.verts.length].x);
    }
    total = Math.abs(total);
    return total/2;
  }

  intersects(other){
    if (other instanceof Rectangle){
      return this.edges.some((e)=>e.itersects(other)) || this.contains(other);
    } else if (other instanceof Circle){
      return this.edges.some((e)=>e.itersects(other)) || this.contains(other);
    } else if (other instanceof Point) {
      return this.contains(other);
    } else if (other instanceof Line) {
      return this.edges.some((e)=>e.itersects(other)) || this.contains(other);
    } else if (other instanceof Polygon) {
      return this.edges.some((e)=>other.edges.some((o)=>o.intersects(e))) || this.contains(other);
    }
    //return (this.edges.some((e)=>{e.intersects(other)})||this.contains(other));
  }

  nearestVert(point){
    let close = null;
    let closeDist = Infinity;
    for (let p of this.verts){
      let dist = point.distance2(p);
      if (dist < closeDist){
        close = p;
        closeDist = dist;
      }
    }
    return close;
  }

  contains(other){
    if (other instanceof Rectangle) {
      return other.corners.every((p)=>{
        return this.contains(p);
      })
    } else if (other instanceof Circle) {
      let close = this.nearestVert(other).distance2(other);
      return ((!(this.edges.some((e)=>{return other.intersects(e)}))) && other.r ** 2 < close && this.contains(new Point(other.x, other.y)))
    } else if (other instanceof Point){
      return ((this.edges.reduce((t, e)=>{return t + ((new Line(other, new Point(this.extremes.bx.x + 50, other.y))).intersects(e)?1:0);}, 0) % 2) == 1);
    } else if (other instanceof Line){
      return (this.contains(other.a) && this.contains(other.b));
    } else if (other instanceof Polygon) {
      return other.verts.every((p)=>{
        return this.contains(p);
      })
    } else throw new Error('Polygon: contains(other) expects other to be either a point, line or polygon. Got ' + other.constructor.name)
  }

  show(gc){
    gc.fill(0,255,0,0.3);
    gc.stroke(0,255,0);
    gc.ctx.beginPath()
    for (let i in this.edgeLoops) {
      gc.ctx.moveTo(this.edgeLoops[i][0].x, this.edgeLoops[i][0].y);
      for (let j = 1; j < this.edgeLoops[i].length ; j ++) {
        gc.ctx.lineTo(this.edgeLoops[i][j].x, this.edgeLoops[i][j].y);

      }
      gc.ctx.closePath();
    }
    gc.ctx.fill("evenodd");
    gc.ctx.stroke();
  }

  highlight(gc){
    gc.fill(255,255,0,0.3);
    gc.stroke(255,255,0);
    gc.ctx.beginPath()
    for (let i in this.edgeLoops) {
      gc.ctx.moveTo(this.edgeLoops[i][0].x, this.edgeLoops[i][0].y);
      for (let j = 1; j < this.edgeLoops[i].length ; j ++) {
        gc.ctx.lineTo(this.edgeLoops[i][j].x, this.edgeLoops[i][j].y);

      }
      gc.ctx.closePath();
    }
    gc.ctx.fill("evenodd");
    gc.ctx.stroke();
  }
}

module.exports = {Rectangle, Circle, Line, Polygon};
