const Color = require('./Color.js')

class Gradient {
  constructor(stops){
    this.stops = [];
    for (let stop of stops) {
      this.addColorStop(...stop);
    }
  }

  addColorStop(offset, color){
    if (!color instanceof Color) throw new Error("Argument 2 'color' must be of type Color. Got " + color.constructor.name);
    let i = this.stops.findIndex(e=>e[0]<=stop);
    this.stops.splice(i, 0, [offset, color]);
  }

  getColor(offset){
    if (this.stops.length == 0) return new Color(0,0,0,0);
    if (this.stops.length == 1) return this.stops[0][1];
    let j = this.stops.findIndex(e=>e[0] >= offset);
    let i = j - 1;
    // console.log(i, j);
    if (j < 0) return this.stops[this.stops.length - 1][1];//Offset is greater than all stops, therefore return last color.
    if (i < 0) return this.stops[j][1];//offset is smaller than all stops, therefore return first color.
    let min = this.stops[i];
    let max = this.stops[j];
    let scaled = (offset - min[0]) / (max[0] - min[0]);
    let r = (1-scaled) * min[1].r + scaled * max[1].r;
    let g = (1-scaled) * min[1].g + scaled * max[1].g;
    let b = (1-scaled) * min[1].b + scaled * max[1].b;
    let a = (1-scaled) * min[1].a + scaled * max[1].a;
    return new Color (r,g,b,a);
  }
}

module.exports = Gradient;
