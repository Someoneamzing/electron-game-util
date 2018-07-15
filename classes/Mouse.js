const Point = require('./Point.js');

class Mouse extends Point {
  constructor(x,y,canvas,control){
    super(x,y);
    this.left = false;
    this.right = false;
    this.middle = false;
    this.lastRight = false;
    this.lastLeft = false;
    this.lastMiddle = false;
    this.canvas = canvas;
    this.control = control;
    this.canvas.canvas.onmousedown = (e)=>{
      switch(e.which){
        case 1:
          this.left = true;
          this.lastLeft = true;
          break;
        case 2:
          this.middle = true;
          this.lastMiddle = true;
          break;
        case 3:
          this.right = true;
          this.lastRight = true;
          break;
      }
      this.move(e.offsetX + this.canvas.camera.x - this.canvas.w/2, e.offsetY + this.canvas.camera.y - this.canvas.h/2);
      //this.control.update();
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
      //this.control.update();
    }

    this.canvas.canvas.onmousemove = (e)=>{
      this.move(e.offsetX + this.canvas.camera.x - this.canvas.w/2, e.offsetY + this.canvas.camera.y - this.canvas.h/2);
    }
  }

  endCycle(){
    this.lastRight = this.right;
    this.lastLeft = this.left;
    this.lastMiddle = this.middle;
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
    pack.lastLeft = this.lastLeft;
    pack.lastRight = this.lastRight;
    pack.lastMiddle = this.lastMiddle;
    return pack;
  }

  getUpdatePkt(){
    let pack = {};
    pack.x = this.x;
    pack.y = this.y;
    pack.left = this.left;
    pack.right = this.right;
    pack.middle = this.middle;
    pack.lastLeft = this.lastLeft;
    pack.lastRight = this.lastRight;
    pack.lastMiddle = this.lastMiddle;
    return pack;
  }

}

module.exports = Mouse;
