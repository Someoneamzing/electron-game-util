let canvas = document.getElementById('canvas');
let gc = new GameCanvas({canvas, full: true});
let tree = new QuadTree(new Rectangle(0,0,900,900), 10);
gc.resize();
//let query = new Polygon([new Point(-10,-10),new Point(10,-10),new Point(10,10),new Point(-10,10), new Point(-15, 0)]);
let query = new Circle(0,0,10);
console.log(query);
let line = new Line(-250, -200, -300, -300);//new Rectangle(Math.floor(Math.random() * 900) - 450,Math.floor(Math.random() * 900) - 450, 32, 32);
//let poly = new Polygon([new Point(-100,-100),new Point(100,-100),new Point(100,100),new Point(-100,100), new Point(-150, 0)],[new Point(-20,-20),new Point(20,-20),new Point(20,20),new Point(-20,20), new Point(-30, 0)], [new Point(-50, -50), new Point(0, -50), new Point(-50, 0)]);

let Timer = new OutTimer("test");


console.time("Delay")
console.time("Nameless")
let delay = Timer.newTimer("delay", 1000, console.timeEnd, "Delay");
let nameless = Timer.newTimer(1000, console.timeEnd, "Nameless");
Timer.delayTimer(delay, 1000);


let tp = 20;//Math.random() * 20
let circ = new Point(0,0);
let pols = [];
// gc.camera.setFollow([circ]);

for (let i = 0; i < 20; i ++){
  let tv = Math.floor(Math.random() * 3) + 3;
  let points = [];
  for (let j = 0; j < tv; j ++){
    let r = Math.floor(Math.random() * 100);
    let a = (Math.PI * 2 / tv) * j;
    points.push(new Point(r * Math.cos(a), r * Math.sin(a)));
  }
  let poly = new Polygon(points)
  poly.x = Math.floor(Math.random() * 1000) - 500;
  poly.y = Math.floor(Math.random() * 1000) - 500;
  pols.push(poly);
}

pols.push(new Polygon([(new Point(-100, -100)),( new Point(100,-100)),( new Point(100, 100)), (new Point(-100, 100))]));

//
for (let i = 0; i < 1000; i ++) {
  tree.insert(new Rectangle(Math.floor(Math.random() * 900) - 450,Math.floor(Math.random() * 900) - 450, 32, 32));
}

let placing = false;

let angle = 0;

function render() {
  gc.begin();
  line.show(gc);

  query.show(gc)

  for (let poly of pols) {
    poly.show(gc);
    gc.noStroke();
    gc.fill('black');
    if (poly.contains(query)) poly.highlight(gc);
    gc.text("(" + poly.area() + ")", poly.x, poly.y);
  }

  gc.end();
  window.requestAnimationFrame(render);
}

canvas.onmousemove = (e)=>{
  query.x = e.offsetX - canvas.width/2;
  query.y = e.offsetY - canvas.height/2;
}

canvas.onmousedown = (e)=>{
  placing=true;
}

canvas.onmouseup = (e)=>{
  placing=false;
}

window.onresize = (e)=>{
  gc.resize();
}

window.requestAnimationFrame(render);
