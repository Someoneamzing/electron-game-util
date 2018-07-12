const Camera = require('./Camera.js')

module.exports = class GameCanvas {
  constructor(opts){
    let {full = false, width = 300, height = 300, camera = new Camera(0,0, this)} = opts;
    this.full = full;
    this.w = width;
    this.h = height;
    this.camera = camera;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.shouldFill = true;
    this.shouldStroke = true;
    document.body.appendChild(this.canvas);
  }

  clear(){
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  begin(){
    this.camera.move();
    this.ctx.save();
    this.clear();
    this.ctx.translate(-this.camera.x + this.w/2, -this.camera.y + this.h/2);
  }

  end(){
    this.ctx.restore();
  }

  stroke(...args){
    this.shouldStroke = true;
    switch(args.length){
      case 1:
        this.ctx.strokeStyle = args[0];
        break;
      case 2:
        this.ctx.strokeStyle = 'rgba(' + args[0] + ', ' + args[0] + ', ' + args[0] + ', ' + args[1] + ')';
        break;
      case 3:
        this.ctx.strokeStyle = 'rgb(' + args[0] + ', ' + args[1] + ', ' + args[2] + ')';
        break;
      case 4:
        this.ctx.strokeStyle = 'rgba(' + args[0] + ', ' + args[1] + ', ' + args[2] + ', ' + args[3] + ')';
        break;
      default:
        throw new Error("GameCanvas: stroke( ... ) expects 1 - 4 arguments. Got " + args.length);
    }
  }

  fill(...args){
    this.shouldFill = true;
    switch(args.length){
      case 1:
        this.ctx.fillStyle = args[0];
        break;
      case 2:
        this.ctx.fillStyle = 'rgba(' + args[0] + ', ' + args[0] + ', ' + args[0] + ', ' + args[1] + ')';
        break;
      case 3:
        this.ctx.fillStyle = 'rgb(' + args[0] + ', ' + args[1] + ', ' + args[2] + ')';
        break;
      case 4:
        this.ctx.fillStyle = 'rgba(' + args[0] + ', ' + args[1] + ', ' + args[2] + ', ' + args[3] + ')';
        break;
      default:
        throw new Error("GameCanvas: fill( ... ) expects 1 - 4 arguments. Got " + args.length);
    }
  }

  noStroke(){
    this.shouldStroke = false;
  }

  noFill(){
    this.shouldFill = false;
  }

  rect(x,y,w,h){
    if (this.shouldFill) {
      this.ctx.fillRect(x - w/2, y - h/2, w, h);
    }
    if (this.shouldStroke) {
      this.ctx.strokeRect(x - w/2, y - h/2, w, h);
    }
  }

  circle(x, y, r, a = 2 * Math.PI){
    if (this.shouldFill) {
      this.ctx.beginPath();
      this.ctx.arc(x,y,r,0,a);
      this.ctx.fill();
    }
    if (this.shouldStroke) {
      this.ctx.beginPath();
      this.ctx.arc(x,y,r,0,a);
      this.ctx.stroke();
    }
  }

  resize(){
    if (!this.full) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.w = width;
    this.h = height;
  }
}
