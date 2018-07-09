exports = class Point {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  distance2(other){
    return (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
  }

  show(gc){
    gc.strokeStyle = "#00f";
    gc.lineWidth = 1;
    gc.beginPath();
    gc.arc(this.x,this.y,1,0,2 * Math.PI);
    gc.stroke();
  }

  highlight(gc) {
    gc.strokeStyle = "#ff0";
    gc.lineWidth = 5;
    gc.beginPath();
    gc.arc(this.x,this.y,5,0,2 * Math.PI);
    gc.stroke();
  }
}
