const Camera = require('./Camera.js')

exports = class GameCanvas {
  constructor(opts = {full: false, width: 300, height: 300, camera: new Camera(0,0, this)}){
    this.full = opts.full;
    this.w = opts.width;
    this.h = opts.h;
    this.camera = opts.camera;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  begin(){
    this.camera.move();
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y)
  }

  end(){
    this.ctx.restore();
  }
}
