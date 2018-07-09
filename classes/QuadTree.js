const Point = require("./Point.js");
const Rectangle = require("./Rectangle.js");
const Circle = require("./Circle.js");

class QuadTree {
  constructor(boundry, cap, level = 0) {
    if (!(boundry instanceof Rectangle)) {throw new Error("QuadTree: QuadTree requires boundry to be of type Rectangle. The provided value was of type " + boundry.constructor.name)};
    this.boundry = boundry;
    if (isNaN(Number(cap))) throw new Error("QuadTree: QuadTree requires cap to be a valid number or a value that is convertable to a number. The provided value was of type " + typeof cap);
    this.cap = Number(cap);
    this.children = [];
    this.nodes = [];
    this.level = level;
  }

  insert(point){
    if (!this.boundry.contains(point)) return "Not in boundry";
    if (this.nodes.length > 0) {
      for(let i in this.nodes){
        this.nodes[i].insert(point);
      }
    } else {
      this.children.push(point);
      if (this.children.length > this.cap) {
        this.subdivide();
        for (let i in this.children){
          this.insert(this.children[i]);
        }
        this.children.length = 0;
      }
    }
  }

  subdivide() {
    let qw = this.boundry.w/4;
    let qh = this.boundry.h/4;
    this.nodes[QuadTree.TL] = new QuadTree(new Rectangle(this.boundry.x - qw, this.boundry.y - qh, qw * 2, qh * 2), this.cap, this.level + 1);
    this.nodes[QuadTree.TR] = new QuadTree(new Rectangle(this.boundry.x + qw, this.boundry.y - qh, qw * 2, qh * 2), this.cap, this.level + 1);
    this.nodes[QuadTree.BL] = new QuadTree(new Rectangle(this.boundry.x - qw, this.boundry.y + qh, qw * 2, qh * 2), this.cap, this.level + 1);
    this.nodes[QuadTree.BR] = new QuadTree(new Rectangle(this.boundry.x + qw, this.boundry.y + qh, qw * 2, qh * 2), this.cap, this.level + 1);
  }

  show(gc) {
    // gc.strokeStyle = "#000";
    // gc.lineWidth = 1;
    // gc.strokeRect(this.boundry.x - this.boundry.w/2,this.boundry.y - this.boundry.h/2, this.boundry.w, this.boundry.h);
    if (this.nodes.length > 0) {
      for (let node of this.nodes){
        node.show(gc);
      }
    } else {
      gc.fillStyle = 'hsla(' + (240 - Math.floor(((this.level/5) * 2 + (this.children.length/this.cap))*60)) + ', 100%, 50%, 0.7)';
      gc.fillRect(this.boundry.x - this.boundry.w/2,this.boundry.y - this.boundry.h/2, this.boundry.w, this.boundry.h);
      // for(let point of this.children) {
      //   point.show(gc);
      // }
    }
  }

  query(range, found = new QueryResult(), first = true){
    if (!this.boundry.intersects(range)) return found;
    if (first) {
      found.addGroup('found');
    }
    if (this.nodes.length > 0) {
      for (let node of this.nodes){
        node.query(range, found, false);
      }
    } else {
      for (let p of this.children){
        if (range.intersects(p)) found.insertResult('found',p);
      }
    }
    if (first) found.finalise();
    return found;
  }

  nearest(point, maxRange = this.boundry.w){
    let going = true;
    let range = new Circle(point.x, point.y, 5);
    let res = new QueryResult();
    res.addGroup('found');
    if (this.children.length <= 0 && this.nodes.length <= 0) {
      res.finalise();
      return res;
    }
    while (going) {
      let found = this.query(range);
      if (found.getGroup('found') && found.getGroup('found').length > 0){
        going = false;
        let closestDist = Infinity;
        let closest = null;
        for(let p of found.getGroup('found')){
          let dist = point.distance2(p);
          if (dist < closestDist){
            closestDist = dist;
            closest = p;
          }
        }
        res.insertResult('found', closest);
      }
      if (range.contains(this.boundry || range.r >= maxRange)){
        going = false;
      } else {
        range.r *= 1.5;
      }
    }
    res.finalise();
    return res;
  }
}

QuadTree.TL = 0;
QuadTree.TR = 1;
QuadTree.BL = 2;
QuadTree.BR = 3;
