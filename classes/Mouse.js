const Point = require('./Point.js');

class Mouse extends Point {
  constructor(x,y,canvas,control){
    super(x,y);
    this.left = false;
    this.right = false;
    this.middle = false;
    this.canvas = canvas;
    this.control = control;
    this.canvas.canvas.onmousedown = (e)=>{
      switch(e.which){
        case 1:
          this.left = true;
          break;
        case 2:
          this.middle = true;
          break;
        case 3:
          this.right = true;
          break;
      }
      this.move(e.offsetX + this.canvas.camera.x - this.canvas.w/2, e.offsetY + this.canvas.camera.y - this.canvas.h/2);
      this.control.update();
      console.log("Mouse Down");
    }

    this.canvas.canvas.onmouseup = (e)=>{
      switch(e.which){
        case 1:
          this.left = false;
          break;
        case 2:
          this.middle = false;
          break;
        case 3:
          this.right = false;
          break;
      }
      this.move(e.offsetX + this.canvas.camera.x - this.canvas.w/2, e.offsetY + this.canvas.camera.y - this.canvas.h/2);
      this.control.update();
      console.log("Mouse Up");
    }

    this.canvas.canvas.onmousemove = (e)=>{
      this.move(e.offsetX + this.canvas.camera.x - this.canvas.w/2, e.offsetY + this.canvas.camera.y - this.canvas.h/2);
    }
  }

  move(x,y){
    this.x = x;
    this.y = y;
    this.control.update();
  }

  getInitPkt(){
    let pack = {};
    pack.x = this.x;
    pack.y = this.y;
    pack.left = this.left;
    pack.right = this.right;
    pack.middle = this.middle;
    return pack;
  }

  getUpdatePkt(){
    let pack = {};
    pack.x = this.x;
    pack.y = this.y;
    pack.left = this.left;
    pack.right = this.right;
    pack.middle = this.middle;
    return pack;
  }

}

module.exports = Mouse;
