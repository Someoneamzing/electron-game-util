let canvas = document.getElementById('canvas');
let gc = new GameCanvas({canvas, full: true});
let tree = new QuadTree(new Rectangle(0,0,900,900), 10);
gc.resize();
let query = new Line(0,0,10,10);
let line = new Rectangle(Math.floor(Math.random() * 900) - 450,Math.floor(Math.random() * 900) - 450, 32, 32);
//
for (let i = 0; i < 1000; i ++) {
  tree.insert(new Rectangle(Math.floor(Math.random() * 900) - 450,Math.floor(Math.random() * 900) - 450, 32, 32));
}

let placing = false;

function render() {
  gc.begin();
  // if (placing) {
  //   let total = Math.floor(Math.random() * 10);
  //   for (let i = 0; i < total; i ++) {
  //     tree.insert(query.randomWithin());
  //   }
  // }
  tree.show(gc);
  for (let p of tree.query(query).getGroup('found')) {
    p.highlight(gc);

  }
  // let near = tree.nearest(new Point(query.x,query.y));
  // if (near.status == QueryResult.OK) {
  //   near.getGroup('found')[0].highlight(gc);
  // }
  query.show(gc);

  gc.end();
  window.requestAnimationFrame(render);
}

canvas.onmousemove = (e)=>{
  query.b.x = e.offsetX - canvas.width/2;
  query.b.y = e.offsetY - canvas.height/2;
}

canvas.onmousedown = (e)=>{
  placing=true;
}

canvas.onmouseup = (e)=>{
  placing=false;
}

window.requestAnimationFrame(render);
