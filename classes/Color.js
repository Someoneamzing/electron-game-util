class Color {
  constructor(r, g, b, a) {
    this.elements = new Uint8ClampedArray(4);
    if (r instanceof Color) {
      this.r = r.r;
      this.g = r.g;
      this.b = r.b;
      this.a = r.a;
    } else if (typeof r == 'string') {
      r = r.replace('#', '');
      this.r = parseInt(r.slice(0,2),16);
      this.g = parseInt(r.slice(2,4),16);
      this.b = parseInt(r.slice(4,6),16);
      this.a = r.length > 6 ? parseInt(r.slice(6,8),16) : 255;
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

  get hex(){
    return '#' + (this.r.toString(16).length == 2?'':"0") + this.r.toString(16) + (this.g.toString(16).length == 2?'':"0") + this.g.toString(16) + (this.b.toString(16).length == 2?'':"0") + this.b.toString(16) + (this.a.toString(16).length == 2?'':"0") + this.a.toString(16)
  }
}

module.exports = Color;
