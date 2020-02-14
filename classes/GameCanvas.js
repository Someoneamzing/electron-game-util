const Camera = require('./Camera.js');
const Point = require('./Point.js');
const {RectangleClickRegion} = require('./ClickHandlers.js');

module.exports = class GameCanvas {
  constructor(opts){
    let {full = false, width = 300, height = 300, camera = new Camera(0,0, this), canvas} = opts;
    this.full = full;
    this.w = width;
    this.h = height;
    this.camera = camera;
    this.canvas = canvas?canvas:document.createElement('canvas');
    if (this.full) {
      this.canvas.style.position = 'fixed';
    }
    this.zoom = 1;
    this.ctx = this.canvas.getContext('2d');
    this.opCanvas = document.createElement('canvas');
    this.opCanvas.width = width;
    this.opCanvas.height = height;
    this.opctx = this.opCanvas.getContext('2d');
    // this.ppCanvas = new OffscreenCanvas(this.w, this.h);
    // let gl = ppCanvas.getContext('webgl');
    // this.gl = gl;
    this.shouldFill = true;
    this.shouldStroke = true;
    this.fontSize = 10;
    document.body.appendChild(this.canvas);
    // this.Shader = class Shader {
    //
    // }
  }

  clear(){
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.clearHitRegions();

  }

  font(font, size){
    this.fontSize = size;
    this.ctx.font = size + 'px ' + font;
  }

  filter(filter){
    this.ctx.filter = filter;
  }

  noFilter(){
    this.ctx.filter = "none";
  }

  text(str, x, y){
    let lines = (str + '').split(/\r?\n/g);
    for (let i in lines) {
      let line = lines[i];
      let offset = i * this.fontSize;
      if(this.shouldFill){
        this.ctx.fillText(line, x, y + offset);
      }
      if (this.shouldStroke) {
        this.ctx.strokeText(line, x, y + offset);
      }
    }

  }

  textAlign(h,v){
    this.ctx.textAlign = h;
    this.ctx.textBaseline = v || this.ctx.textBaseline;
  }

  strokeWeight(a) {
    this.ctx.lineWidth = a;
  }

  line(a,b,c,d){
    this.ctx.beginPath();
    this.ctx.moveTo(a,b);
    this.ctx.lineTo(c,d);
    this.ctx.stroke();
  }

  curve(a,b,c,d,e,f,g,h){
    this.ctx.beginPath();
    this.ctx.moveTo(a, b);
    this.ctx.bezierCurveTo(c,d,e,f,g,h);
    this.ctx.stroke();
  }

  begin(){
    this.camera.move();
    this.ctx.save();
    this.clear();
    this.ctx.translate(this.w/2, this.h/2)
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    RectangleClickRegion.list.run('registerRegion', this);

  }

  getTransformedCoords(x, y) {
    return new Point( ( x - this.w / 2) / this.zoom + this.camera.x,  ( y - this.h/2 ) / this.zoom + this.camera.y);
  }

  getScreenCoords(x, y) {
    return new Point( ( x + this.w / 2) * this.zoom - this.camera.x,  ( y + this.h/2) * this.zoom - this.camera.y);
  }

  end(){
    this.ctx.resetTransform();
  }

  putImageData(imageData, ...args) {
    this.opctx.clearRect(0,0, imageData.width, imageData.height)
    this.opctx.putImageData(imageData, 0, 0);
    this.ctx.drawImage(this.opCanvas, ...args);
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

  cornerRect(x,y,w,h){
    if (this.shouldFill) {
      this.ctx.fillRect(x, y, w, h);
    }
    if (this.shouldStroke) {
      this.ctx.strokeRect(x, y, w, h);
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
    let width = document.body.clientWidth;
    let height = document.body.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.w = width;
    this.h = height;

    this.opCanvas.width = width;
    this.opCanvas.height = height;
  }

  postProcess(shader) {

  }

  background(image){
    let {x, y} = this.camera;
    const {width: a, height: b} = image;
    const {w, h} = this;
    x = x - 2 * w;
    y = y - 2 * h;
    let C = [{n: (x - (x%a))/a, m: (y - (y%b))/b},{n: ((x+w) - ((x+w)%a))/a + 2, m: (y - (y%b))/b},{n: (x - (x%a))/a, m: ((y+h) - ((y+h)%b))/b + 2}];
    let imax = C[1].n - C[0].n;
    let jmax = C[2].m - C[0].m;
    //console.log(imax, jmax);
    for (let i = 0; i <= imax; i++){
      for (let j = 0; j <= jmax; j++){
        image.draw(this, (C[0].n + i) * a, (C[0].m + j) * b, a, b);
        //image.drawCenter(this.minimap, {x: (C[0].n + i) * a, y: (C[0].m + j) * b, w: a, h: b});
      }
    }
  }
}
