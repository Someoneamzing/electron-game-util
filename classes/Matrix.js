exports = class Matrix {
  constructor(r,c,f=0){
    this.fields = [];
    for(let i = 0; i < r; i ++){
      this.fields[i] = [];
      for(let j = 0; j < c; j ++){
        this.fields[i][j] = f;
      }
    }
    this.r = r;
    this.c = c;
  }

  fill(f){
    for(let i = 0; i < this.r; i ++){
      for(let j = 0; j < this.c; j ++){
        this.fields[i][j] = f;
      }
    }
    return this;
  }

  set(i,j,v){
    this.fields[i][j] = v;
    return this;
  }

  dot(m){
    if (m instanceof Matrix){
      let res = new Matrix(this.r, m.c);
      for (let i = 0; i < this.r; i ++){
        for (let j = 0; j < m.c; j ++){
          let total = 0;
          for(let c = 0; c < this.c; c ++){
            for (let r = 0; r < m.r; r ++){
              //console.log( i + ", " + c + " | " + r + ", " + j);
              total += this.fields[i][c] * m.fields[r][j];
            }
          }
          res.set(i,j,total);
        }
      }
      return res;
    } else if (!isNaN(Number(m))){
      m = Number(m);
      for(let i = 0; i < this.r; i ++){
        for(let j = 0; j < this.c; j ++){
          this.fields[i][j] *= m;
        }
      }
      return this;
    }
  }

  toHTML(){
    let res = $("<table style='border-collapse: collapse;' class='matrix'><tbody><tr><td>┌</td></tr></tbody></table>");
    for (let c = 0; c < this.c; c ++){
      res.find("tbody tr:first-child").append("<td> </td>");
    }
    res.find("tbody tr:first-child").append("<td>┐</td>");
    for(let i = 0; i < this.r; i ++){
      res.find("tbody").append("<tr><td>│</td></tr>");
      for(let j = 0; j < this.c; j ++){
        res.find("tbody tr:nth-child(" + (i + 2) + ")").append("<td>" + this.fields[i][j] + "</td>")
      }
      res.find("tbody tr:nth-child(" + (i + 2) + ")").append("<td>│</td>");
    }
    res.find('tbody').append("<tr><td>└</td></tr>");
    for (let c = 0; c < this.c; c ++){
      res.find("tbody tr:last-child").append("<td> </td>");
    }
    res.find("tbody tr:last-child").append("<td>┘</td>");

    return res;
  }
}
