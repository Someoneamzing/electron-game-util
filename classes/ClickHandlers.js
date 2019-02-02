const {Rectangle} = require("./Shapes.js");
const ClientTrackList = require('./ClientTrackList.js');
const GameObject = require('./GameObject.js');

let list = new ClientTrackList();

class RectangleClickRegion extends GameObject(Rectangle, list) {
  constructor(opts) {
    let {x, y, w, h, cursor = "select"} = opts;
    super(opts, x, y, w, h);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cursor = cursor;
    this.listeners = {};
    this.gc = null;
    this.refreshRegion();
  }

  on(event, handler){
    if (!this.listeners[event]) this.listeners[event] = [];
    if (this.listeners[event].indexOf(handler) < 0)this.listeners[event].push(handler);
  }

  once(event, handler){
    if (!this.listeners[event]) this.listeners[event] = [];
    let emitter = this;
    let handle = function(...rest){
      emitter.off(event, handle);
      handler(...rest);
    }
    this.listeners[event].push(handle);
  }

  off(event, handler){
    this.listeners[event]?this.listeners[event].splice(this.listeners[event].indexOf(handler), 1):"";
  }

  emit(event, ...data){
    if (this.listeners[event])
    for(let handler of this.listeners[event]){
      handler(...data);
    }
  }

  set x(x){
    this._x = x;
    this.refreshRegion();
  }

  set y(y){
    this._y = y;
    this.refreshRegion();
  }

  set w(w){
    this._w = w;
    this.refreshRegion();
  }

  set h(h){
    this._h = h;
    this.refreshRegion();
  }

  get x(){return this._x};
  get y(){return this._y};
  get w(){return this._w};
  get h(){return this._h};

  handleEvent(event){
    if (event.region) {
      if (event.region == this.netID) {
        this.emit(event.type, event);
      }
    }
  }

  registerRegion(gc) {
    if (this.gc !== gc) {
      if (this.gc) this.gc.ctx.removeHitRegion(this.netID);
      for (let event of RectangleClickRegion.HANDLED_EVENTS){
        if (this.gc) this.gc.canvas.removeEventListener(event, this.handleEvent);
        gc.canvas.addEventListener(event, this.handleEvent.bind(this));
      }
      this.gc = gc;
    }
    this.gc.ctx.addHitRegion({path: this.region, id: this.netID, cursor: this.cursor});
  }

  refreshRegion(){
    this.region = new Path2D();
    this.region.rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    // this.region.fill();
  }

  show(gc){
    gc.ctx.fill(this.region);
  }
}

list.setType(RectangleClickRegion);

RectangleClickRegion.list = list;

RectangleClickRegion.HANDLED_EVENTS = ["click","dblclick","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","wheel"]

module.exports = {RectangleClickRegion};
