

const FILE_EXT_REG = (/(?:.+[\/\\])?[^\s\\\/]+\.([A-z]+)$/);
const VALID_SPRITE_EXT = ['png','jpg','jpeg','gif'];
/**
 * @module electron-game-util
 */
class Sprite extends Image {
  constructor(name,src,width,height,frameWidth,frameHeight,animate){
    super(width, height)
    this.name = name;
    this.toSrc = src;
    this.renderURLS = [];
    this.found = false;
    this.i = 0;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frames = this.width / this.frameWidth;
    if (animate) {
      Sprite.animate.push(this);
    }
    Sprite.list[this.name] = this;
    Sprite.total ++;
  }

  draw(gc, x, y, w = this.frameWidth, h = this.frameHeight, a = 0, i = this.i){
    if (a != 0) {
      gc.ctx.save();
      gc.ctx.translate(x, y);
      gc.ctx.rotate(a);
      gc.ctx.drawImage(this, i * this.frameWidth, 0, this.frameWidth, this.frameHeight, -w/2, -h/2, w, h);
      gc.ctx.restore();
    } else gc.ctx.drawImage(this, i * this.frameWidth, 0, this.frameWidth, this.frameHeight, x - w/2, y - h/2, w, h);
  }

  drawAsMask(gc, color, x, y, w = this.frameWidth, h = this.frameHeight, a = 0, i = this.i) {
    gc.opctx.save();
    let prevOp = gc.opctx.globalCompositeOperation;
    gc.opctx.clearRect(0,0,w,h);
    gc.opctx.globalCompositeOperation = 'source-over';
    gc.opctx.translate(w/2, h/2);
    gc.opctx.rotate(a);
    gc.opctx.drawImage(this, i * this.frameWidth, 0, this.frameWidth, this.frameHeight, -w/2, -h/2, w, h);
    gc.opctx.restore();
    gc.opctx.globalCompositeOperation = 'source-in';
    gc.opctx.fillStyle = color;
    gc.opctx.fillRect(0,0, w, h);
    gc.opctx.globalCompositeOperation = prevOp;

    gc.ctx.drawImage(gc.opCanvas,0,0,w,h, x - w/2, y - h/2,w,h);
  }

  getSpriteURL(){
    return this.renderURLS[this.i];
  }

  load(){
    return new Promise((resolve, reject)=>{
      this.onload = ()=>{
        this.found = true;
        Sprite.staticCanvas.width = this.frameWidth;
        Sprite.staticCanvas.height = this.frameHeight;
        for (let i = 0; i < this.frames; i ++) {
          Sprite.staticContext.clearRect(0,0,this.frameWidth,this.frameHeight);
          Sprite.staticContext.drawImage(this, i * this.frameWidth, 0, this.frameWidth, this.frameHeight, 0, 0, this.frameWidth, this.frameHeight);
          this.renderURLS.push(Sprite.staticCanvas.toDataURL());
        }
        resolve(this);
      }
      this.onerror = ()=>{
        this.found = false;
        resolve(this);
      }
      this.src = this.toSrc;
    })
  }

  static async loadAll(bar){
    bar.attr('max', Sprite.total);
    bar.show();
    for(let id in Sprite.list){
      await Sprite.list[id].load();
      bar.attr('value', (i, orig)=>{
        return Number(orig) + 1;
      })
    }
    bar.hide();
  }

  static endDraw(){
    for (let sprite of Sprite.animate){
      sprite.i ++;
      if (sprite.i >= sprite.frames) sprite.i = 0;
    }
  }

  static get(name){
    let s = Sprite.list[name];
    if (s) {
      return s;
    } else {
      return Sprite.none;
    }
  }

  static async loadFolder(namespace,folderName){
    let files = fs.readdirSync(folderName, {withFileTypes: true});
    for (let file of files){
      // console.log(file)
      if (VALID_SPRITE_EXT.includes(file.replace(FILE_EXT_REG,'$1'))){
        let s = new Sprite(namespace + ":" + folderName + "/" + file, path.join(folderName, file));
        await s.load();
      }
    }
  }

}

let c = document.createElement('canvas');
c.width = 32;
c.height = 32;
let ctx = c.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0,0,32,32);
ctx.fillStyle = '#ff00ff';
ctx.fillRect(0,0,16,16);
ctx.fillRect(16,16,16,16);


Sprite.list = {};
Sprite.animate = [];
Sprite.total = 0;

Sprite.staticCanvas = c;
Sprite.staticContext = ctx;

Sprite.none = new Sprite('none', c.toDataURL(), 32, 32, 32, 32, false);

module.exports = Sprite;
