class Color {
  constructor(r, g, b, a) {
    this.elements = new Uint8ClampedArray(4);
    if (r instanceof Color) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = r.a;
    } else {
      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a || 0;
    }
  }

  get r(){
    return this.elements[0];
  }

  set r(val){
    this.elements[0] = val;
  }

  get g(){
    return this.elements[1];
  }

  set g(val){
    this.elements[1] = val;
  }

  get b(){
    return this.elements[2];
  }

  set b(val){
    this.elements[2] = val;
  }

  get a(){
    return this.elements[3];
  }

  set a(val){
    this.elements[3] = val;
  }
}

module.exports = Color;
