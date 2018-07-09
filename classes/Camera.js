const Point = require('./Point.js');
exports = class Camera extends Point {
  constructor(x,y, canvas, follow = []){
    super(x,y);
    this.gc = canvas;
    this.follow = follow;
  }

  move(x, y) {
    if (x instanceof Point) {
      this.x = x.x;
      this.y = x.y;
    } else if (x !== undefined && y !== undefined) {
      this.x = x;
      this.y = y;
    } else {
      let pos = average(this.follow);
      this.x = pos.x;
      this.y = pos.y;
    }
  }
}
