class NavMesh {
  constructor(bounds){
    this.parts = [];
    this.bounds = bounds;
  }

  addPoly(poly){
    let avg = average(poly.verts);
    poly.avg = null;
    if (poly.contains(avg)) {
      poly.avg = avg;
    }
    this.parts.push(poly);
  }

  show(gc){
    for(let p of this.parts){
      p.show(gc);
    }
  }
}

module.exports = NavMesh;
