const NetworkWrapper = require('./NetworkWrapper.js');
const TrackList = require('./TrackList.js');
const EventEmitter = require('events');
const ConnectionManager = require('./ConnectionManager.js');

let list = new ClientTrackList();

class GUI extends GameObject(Object, list) {
  constructor(server, name){
    super();
    this.name = name;
    this.server = server;
    if (SIDE = ConnectionManager.SERVER) {
      this.io = this.server.io.of('gui-' + name);
      // this.io.on('connection')
      this.connnectedClients = [];
    }
    this.elements = [];


  }

  registerElements(){

  }
}

let GUIElement;

if (SIDE == ConnectionManager.SERVER) {
  GUIElement = class extends EventEmitter {
    constructor(server, opts = {}){

    }

    on(type, handler) {

    }
  }
}

if (SIDE == ConnectionManager.CLIENT) {
  GUIElement = class extends HTMLElement {
    constructor() {
      super();
      EventEmitter.call(this);
      this.propPath = null;

    }

    eventHandler(e){
      this.emit(e.type, e);
    }

    on(type, handler){
      super.on(type, handler);
      this.addEventListener(type, this.eventHandler);
    }

    once(type, handler){
      super.once(type, handler);
      this.addEventListener(type, this.eventHandler, {once: true});
    }

    off(type, handler) {
      super.off(type, handler);
      if (this.listenerCount(type) < 1)
        this.removeEventListener(type, this.eventHandler);
    }

    connectedCallback(){
      let [x,y,w,h,prop] = [this.getAttribute('x'), this.getAttribute('y'), this.getAttribute('w'), this.getAttribute('h'), this.getAttribute('prop')];
      this.style.left = x + "px";
      this.style.top = y + "px";
      this.style.width = w + "px";
      this.style.height = h + "px";
      this.propPath = prop;
    }

    disconnectedCallback(){

    }
  }

  completeAssign(GUIElement.prototype, EventEmitter.prototype);

  GUIElement.prototype.constructor = GUIElement;

  customElements.define('gui-element', GUIElement);
}

list.setType(GUI);

GUI.list = list;
