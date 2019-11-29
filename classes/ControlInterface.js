const Mouse = require('./Mouse.js');

class ControlInterface {
  constructor(canvas, client){
    //console.log(canvas);
    this.canvas = canvas;
    this.client = client;
    this.keys = {};
    this.keysPressed = {};
    this.keysReleased = {};
    this.listeners = {};
    this.mouse = new Mouse(0,0,this.canvas, this);
    window.addEventListener('keydown', (e)=>{
      let key = e.key.toUpperCase();
      // console.log(key);
      if (!this.keys[key]) this.keysPressed[key] = true;

      this.keys[key] = true;
      if (key in this.listeners){
        for(let f of this.listeners[key]){
          f();
        }
      }
      //console.log('Key Down');
    })

    window.addEventListener('keyup', (e)=>{
      let key = e.key.toUpperCase();
      console.log(key);
      if (this.keys[key]) this.keysReleased[key] = true;
      this.keys[key] = false;
      if (this.client) this.client.send("controlinterface-key-update", this.getUpdatePkt());
      //console.log('Key Up');
    })

    window.addEventListener('keypress', (e)=>{
      let key = e.key.toUpperCase();
      if (this.client) this.client.send("controlinterface-key-update", this.getUpdatePkt());
      //console.log('Key Pressed');
    })



    if (this.client) {
      markTime('controlinterface-init', 'send');
      this.client.send("controlinterface-init", this.getInitPkt());
    }
  }

  on(key, f){
    if (!(key in this.listeners)) this.listeners[key] = [];
    this.listeners[key].push(f);
  }

  off(key, f){
    if (!(key in this.listeners))
      this.listeners[key].splice(this.listeners[key].indexOf(f), 1);
  }

  endCycle(){
    for(let key in this.keysPressed){
      this.keysPressed[key] = false;
    }

    for (let key in this.keysReleased) {
      this.keysReleased[key] = false;
    }
    this.mouse.endCycle();
    this.update();
  }

  getInitPkt(){
    let pack = {};
    pack.keys = this.keys;
    pack.keysPressed = this.keysPressed;
    pack.keysReleased = this.keysReleased;
    pack.mouse = this.mouse.getInitPkt();
    return pack;
  }

  getUpdatePkt(){
    let pack = {};
    pack.keys = this.keys;
    pack.keysPressed = this.keysPressed;
    pack.keysReleased = this.keysReleased;
    pack.mouse = this.mouse.getUpdatePkt();
    return pack;
  }

  update(){
    if (this.client) this.client.send("controlinterface-key-update", this.getUpdatePkt());
  }

  key(key){
    return this.keys[key] || false;
  }

  keyDown(key) {
    return this.keysPressed[key] || false;
  }

  keyUp(key) {
    return this.keysReleased[key] || false;
  }
}

module.exports = ControlInterface;
