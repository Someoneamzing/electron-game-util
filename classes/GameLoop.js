class GameLoop {
  constructor(renderLoop,p){
    this.loopID = null;
    this.p = p;
    this.isRender = true && renderLoop;
    this.loop = ()=>{};
    this.renderLoop = this.renderLoop.bind(this);
    this.status = 'paused';
  }

  pause(){
    if (!this.isRender) clearInterval(this.loopID);
    this.status = 'paused';
  }

  async renderLoop(){
    await this.loop();
    if (this.status == 'running') requestAnimationFrame(this.renderLoop);
  }

  play(){
    if (!this.isRender) {
      this.loopID = setInterval(this.loop, this.p);
    } else {
      requestAnimationFrame(this.renderLoop);
    }
    this.status = 'running';
  }

  setLoop(f){
    this.loop = f;
  }
}

module.exports = GameLoop;
