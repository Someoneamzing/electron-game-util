const FILE_EXT_REG = (/(?:.+[\/\\])?[^\s\\\/]+\.([A-z]+)$/);
const VALID_SPRITE_EXT = ['png','jpg','jpeg','gif'];

exports = class Sprite extends Image {
  constructor(name,src,width,height,frameWidth,frameHeight,animate){
    super(width, height)
    this.name = name;
    this.toSrc = src;
    this.found = false;
    this.frameWidth = frameWidth;
    this.frameHeight = freameHeight;
    if (animate) Sprite.animate.push(this);
    Sprite.list[this.name] = this;
  }

  load(){
    return new Promise((resolve, reject)=>{
      this.onload = ()=>{
        this.found = true;
        resolve(this);
      }
      this.onerror = ()=>{
        this.found = false;
        resolve(this);
      }
      this.src = this.toSrc;
    })
  }

  static async loadFolder(namespace,folderName){
    let files = fs.readdirSync(folderName);
    for (let file of files){
      console.log(file)
      if (VALID_SPRITE_EXT.includes(file.replace(FILE_EXT_REG,'$1'))){
        let s = new Sprite(namespace + ":" + folderName + "/" + file, path.join(folderName, file));
        await s.load();
      }
    }
  }
}

Sprite.list = {};
Sprite.animate = [];
