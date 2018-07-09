let canvas = document.getElementById('canvas');
let gc = canvas.getContext('2d');
let tree = new QuadTree(new Rectangle(0,0,900,900), 10);
let query = new Circle(30,30,10);
//
// for (let i = 0; i < 1000; i ++) {
//   tree.insert(new Point(Math.floor(Math.random() * 900) - 450,Math.floor(Math.random() * 900) - 450));
// }

let placing = false;

function render() {
  gc.clearRect(0,0,canvas.width, canvas.height)
  gc.save();
  gc.translate(canvas.width/2, canvas.height/2);
  if (placing) {
    let total = Math.floor(Math.random() * 10);
    for (let i = 0; i < total; i ++) {
      tree.insert(query.randomWithin());
    }
  }
  tree.show(gc);
  // for (let p of tree.query(query)) {
  //   p.highlight(gc);
  // }
  let near = tree.nearest(new Point(query.x,query.y));
  if (near.status == QueryResult.OK) {
    near.getGroup('found')[0].highlight(gc);
  }
  query.show(gc);
  gc.restore();
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

window.requestAnimationFrame(render);
