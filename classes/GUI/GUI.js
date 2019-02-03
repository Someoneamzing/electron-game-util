const ConnectionManager = require('../ConnectionManager.js');
const EventEmitter = require('events');
const GUIElement = require('./GUIElement.js');

class GUI extends EventEmitter {
  constructor(name, w, h, server) {
    super();
    this.name = name;
    this.w = w;
    this.h = h;
    this.server = server;
    this.elements = {};
    this.element = null;
    this.accessingSockets = {};
    this.watchedObjects = {};
    if (server.side == ConnectionManager.SERVER) {

    } else {
      this.server.socket.on('gui-open-' + this.name, this.open.bind(this));
      this.server.socket.on('gui-close-' + this.name, this.close.bind(this));
      this.element = document.createElement('gui-container');
      this.element.style.width = this.w + "px";
      this.element.style.height = this.h + "px";
      // document.body.append(this.element);
    }

    GUI.list[name] = this;
  }

  addElement(e){
    this.elements[e.name] = e;
    e.setGUI(this);
    if (this.server.side == ConnectionManager.CLIENT) this.element.shadowRoot.append(e);
  }

  registerElements(){
    ;
  }

  getInitialData(object) {
    return Object.keys(this.elements).map(name=>{
      let element = this.elements[name];
      return [name, element.propNames.reduce((out, prop)=>{out[prop] = object[prop];return out;}, {})];
    })
  }

  open(socket, object) {
    if (this.server.side == ConnectionManager.SERVER) {
      this.accessingSockets[socket.id] = {socket, object};
      socket.emit('gui-open-' + this.name, {initialData: this.getInitialData(object)});
      if (!(object.netID in this.watchedObjects)) {
        this.watchedObjects[object.netID] = {sockets: [socket], object};
        for (let name in this.elements) {
          let element = this.elements[name];
          // console.log(object, object[element.propNames]);
          for (let propName of element.propNames) {
            object.watch(propName, (prop, oldVal, newVal)=>{
              console.log("Object property changed");
              for (let socket of this.watchedObjects[object.netID].sockets) {
                socket.emit('gui-prop-change-' + element.name, prop, oldVal, newVal);
              }
            })
          }
        }
      } else {
        this.watchedObjects[object.netID].sockets.push(socket);
      }
    } else {
      this.element.removeAttribute('hidden');
      for (let data of socket.initialData) {
        for (let prop in data[1]){
          this.elements[data[0]].setValue(prop, data[1][prop]);
        }
      }
    }
  }

  close(socket) {
    if (this.server.side == ConnectionManager.SERVER) {
      if (!this.accessingSockets[socket.id]) return;
      let object = this.accessingSockets[socket.id].object;
      this.watchedObjects[object.netID].sockets.splice(this.watchedObjects[object.netID].sockets.indexOf(socket), 1);
      if (this.watchedObjects[object.netID].sockets.length == 0) {
        for (let name in this.elements) {
          let element = this.elements[name];
          for (let propName of element.propNames) object.unwatch(propName);
        }
        delete this.watchedObjects[object.netID];
      }
      socket.emit('gui-close-' + this.name);
    } else {
      this.element.setAttribute('hidden', '');
    }
  }

  closeOnObject(object){
    let sockets = this.watchedObjects[object.netID].sockets;
    for (let socket of sockets) {
      this.close(socket);
    }
  }

  static registerAll(element){
    let templateList = document.createElement('div');
    templateList.id = "gui-template-list";
    element.appendChild(templateList);
    GUIElement.registerAll(templateList);
    for (let name in GUI.list){
      let gui = GUI.list[name];
      if (gui.server.side == ConnectionManager.CLIENT){
        element.appendChild(gui.element);
        gui.element.setAttribute('hidden', '');
      }
      gui.registerElements();
    }
  }
}

GUI.list = {};

class ClientGUIContainer extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode: 'open'});

  }

  connectedCallback(){
    this.style.position = "fixed";
    this.style.left = "50%";
    this.style.top = "50%";
    this.style.transform = "translate(-50%, -50%)";
    this.style.zIndex = "6";
    this.style.background = "whitesmoke";
  }
}

customElements.define('gui-container', ClientGUIContainer);

module.exports = GUI;
