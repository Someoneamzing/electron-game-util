const Point = require("./Point.js");
const Rectangle = require("./Rectangle.js");
const Circle = require("./Circle.js");

function clamp(n,low,high) {
  return Math.min(Math.max(n,low),high);
}

function sum(list) {
  if (list[0] instanceof Point) {
    //console.log("Summing Points");
    let totalx = 0;
    let totaly = 0;
    for (let p of list) {
      totalx += p.x;
      totaly += p.y;
    }
    return new Point(totalx,totaly);
  } else {
    let total = 0;
    for (let p of list) {
      total += p;
    }
    return total;
  }
}

function average(list){
  //console.log(list[0].constructor.name);
  if (list[0] instanceof Point) {
    let sumP = sum(list);
    return new Point(sumP.x / list.length, sumP.y / list.length);
  } else {
    return sum(list)/list.length;
  }
}

function shareOne(a,b){
  return a.some(c => b.includes(c));
}

module.exports = {clamp, sum, average, shareOne};
