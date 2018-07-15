const Mouse = require('./Mouse.js');

class ControlInterface {
  constructor(canvas, client){
    //console.log(canvas);
    this.canvas = canvas;
    this.client = client;
    this.keys = {};
    this.keysPressed = {};
    this.listeners = {};
    this.mouse = new Mouse(0,0,this.canvas, this);
    $(window).keydown((e)=>{
      let key = e.key.toUpperCase();
      this.keys[key] = true;
      if (key in this.listeners){
        for(let f of this.listeners[key]){
          f();
        }
      }
      //console.log('Key Down');
    })

    $(window).keyup((e)=>{
      let key = e.key.toUpperCase();
      this.keys[key] = false;
      this.client.send("controlinterface-key-update", this.getUpdatePkt());
      //console.log('Key Up');
    })

    $(window).keypress((e)=>{
      let key = e.key.toUpperCase();
      this.keysPressed[key] = true;
      this.client.send("controlinterface-key-update", this.getUpdatePkt());
      //console.log('Key Pressed');
    })

    this.client.send("controlinterface-init", this.getInitPkt());
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
    this.mouse.endCycle();
    this.update();
  }

  getInitPkt(){
    let pack = {};
    pack.keys = this.keys;
    pack.keysPressed = this.keysPressed;
    pack.mouse = this.mouse.getInitPkt();
    return pack;
  }

  getUpdatePkt(){
    let pack = {};
    pack.keys = this.keys;
    pack.keysPressed = this.keysPressed;
    pack.mouse = this.mouse.getUpdatePkt();
    return pack;
  }

  update(){
    this.client.send("controlinterface-key-update", this.getUpdatePkt());
  }
}

module.exports = ControlInterface;
