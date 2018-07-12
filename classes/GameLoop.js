class GameLoop {
  constructor(id,p){
    this.loopID = null;
    this.p = p;
    this.loop = ()=>{};
    this.status = 'paused';
  }

  pause(){
    clearInterval(this.loopID);
    this.status = 'paused';
  }

  play(){
    this.loopID = setInterval(this.loop, this.p);
    this.status = 'running';
  }

  setLoop(f){
    this.loop = f;
  }
}

module.exports = GameLoop;
