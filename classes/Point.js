class Point {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  distance2(other){
    return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
  }

  intersects(other){
    return other.contains(this);
  }

  set(x, y) {
    if (x instanceof Point) {
      this.x = x.x;
      this.y = y.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  show(gc){
    gc.stroke("#00F");
    gc.noFill();
    gc.ctx.lineWidth = 1;
    gc.circle(this.x,this.y,2);
  }

  highlight(gc) {
    gc.strokeStyle = "#ff0";
    gc.lineWidth = 5;
    gc.beginPath();
    gc.arc(this.x,this.y,5,0,2 * Math.PI);
    gc.stroke();
  }

  static orient(a, b, c){
    let val = ((b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y));
    if (val == 0) {
      return 0;
    } else {
      return val > 0 ? 1 : 2;
    }
  }

  static closestTo(a, others) {
    let dist = Infinity;
    let closest = null;
    for (let p of others) {
      let d = a.distance2(p);
      if (d < dist) {
        dist = d;
        closest = p;
      }
    }
    return closest;
  }
}

Object.defineProperty(Point, 'CO', {
  value: 0,
  writable: false
});

Object.defineProperty(Point, 'CW', {
  value: 1,
  writable: false
});

Object.defineProperty(Point, 'CC', {
  value: 2,
  writable: false
});

module.exports = Point;
