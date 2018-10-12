const NetworkWrapper = require('./NetworkWrapper.js');
const TrackList = require('./TrackList.js');
const EventEmitter = require('events');
const ConnectionManager = require('./ConnectionManager.js');

let list = new TrackList(SIDE);

class GUI extends NetworkWrapper(Object, list) {
  constructor(ID, opts){
    opts.netID = ID;
    super(opts);
    this.template = typeof template == 'string'?$(template):template;

  }

  initServerSide(){
    // TODO: Add element tests
  }

  initClientSide(){
    // TODO: Add element tests
  }
}

if (SIDE == ConnectionManager.SERVER) {
  connection.server.on('GUI-Event', (e)=>{
    let {guiID, type, elementId} = e;
    GUI.list.get(guiID).handleEvent(type, elementId);
  })
}

GUI.ELEMENT_EVENTS = ['click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup', 'mousemove']

GUI.element = class extends EventEmitter {
  constructor(parent, element, x, y, w, h, id){
    super();
    this.id = id;
    this.element = element || $("<div style='color: red'>ERROR: Invalid GUI Element.</div>");
    for (let name of GUI.ELEMENT_EVENTS) {
      this.addEvent(name);
    }

    this.element.width(w);
    this.element.height(h);
  }

  addEvent(name){
    if (SIDE == ConnectionManager.SERVER) throw new Error("GUI: Calling html event registration from server side.");
    this.element.on(name, (e)=>{
      e.preventDefault();
      connection.server.emit('GUI-Event', {type: name, guiId: this.parent, elementId: this.id});
    })
  }
}

GUI.textFieldElement = class extends GUI.element {
  constructor(parent, x, y, w, h, id){
    super(parent, $("<input type='text' value='' />"), x, y, w, h, id);
    this.timeout = null;
    this.element.on('submit', (e)=>{
      e.preventDefault();
      this.element.blur();
    })
    this.element.on('focus', (e)=>{
      this.element.on('keydown', this.type);
    })

    this.element.on('blur', (e)=>{
      this.element.off('keydown', this.type);
      contentsChange();
    })

    this.addEvent('blur');
    this.addEvent('focus');
    this.addEvent('change');
  }

  private type(e) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(contentsChange, 50);
  }

  private contentsChange() {
    this.element.change();
  }
}

GUI.imageElement = class extends GUI.element {
  constructor(parent, src, x, y, w, h, id) {
    super(parent, $("<img>"), x, y, w, h, id);
    this.element.attr('src', src);
  }
}

list.setType(GUI);

GUI.list = list;

module.exports = GUI;
