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
      // this.server.socket.on('gui-event-attach' + this.name, (data)=>{
      //   if (!this.elements[data.name].listeningEvents.includes(data.type)) this.elements[data.name].on(data.type);
      // });

      this.element = document.createElement('gui-container');
      this.element.style.width = this.w + "px";
      this.element.style.height = this.h + "px";
      // document.body.append(this.element);
    }

    this.close = this.close.bind(this);
    this.handleDOMEvent = this.handleDOMEvent.bind(this);

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
      return [name, Object.keys(element.properties).reduce((out, prop)=>{out[prop] = element.properties[prop].value(undefined, object[element.properties[prop].property]);return out;}, {})];
    })
  }

  handleDOMEvent(data){
    for (let handler of this.elements[data.name].eventHandlers[data.type]) {
      handler.call(this.elements[data.name], this.accessingSockets[data.socket].object)
    }
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
          for (let propertyName in element.properties) {
            let property = element.properties[propertyName];
            if (property.type != 'constant') {
              object.watch(property.property, (prop, oldVal, newVal)=>{
                console.log("Object property changed");
                for (let socket of this.watchedObjects[object.netID].sockets) {
                  socket.emit('gui-prop-change-' + element.name, propertyName, oldVal, newVal);
                }
              })
            }
          }
        }
      } else {
        this.watchedObjects[object.netID].sockets.push(socket);
      }
      socket.on('gui-event-emit-' + this.name, this.handleDOMEvent);
      this.accessingSockets[socket.id]._guiDisconnectHandlers?"":this.accessingSockets[socket.id]._guiDisconnectHandlers = {};
      this.accessingSockets[socket.id]._guiDisconnectHandlers[this.name] = ()=>{this.close(socket)};
      socket.on('disconnect', this.accessingSockets[socket.id]._guiDisconnectHandlers[this.name]);
    } else {
      this.element.removeAttribute('hidden');
      for (let data of socket.initialData) {
        for (let prop in data[1]){
          console.log(prop);
          this.elements[data[0]].setValue(prop, data[1][prop]);
        }
      }
    }
  }

  close(socket) {
    console.log(socket);
    if (this.server.side == ConnectionManager.SERVER) {
      if (!this.accessingSockets[socket.id]) return;
      console.log("Closing GUI " + this.name + " for socket " + socket.id);
      let object = this.accessingSockets[socket.id].object;
      this.watchedObjects[object.netID].sockets.splice(this.watchedObjects[object.netID].sockets.indexOf(socket), 1);
      if (this.watchedObjects[object.netID].sockets.length == 0) {
        for (let name in this.elements) {
          let element = this.elements[name];
          for (let propertyName in element.properties) if (element.properties[propertyName].type != 'constant') object.unwatch(element.properties[propertyName].property);
        }
        delete this.watchedObjects[object.netID];
      }
      socket.emit('gui-close-' + this.name);
      socket.off('gui-event-emit-' + this.name, this.handleDOMEvent);
      socket.off('disconnect', this.accessingSockets[socket.id]._guiDisconnectHandlers[this.name]);
      delete this.accessingSockets[socket.id]._guiDisconnectHandlers[this.name];
      delete this.accessingSockets[socket.id];
    } else {
      this.element.setAttribute('hidden', '');
    }
  }

  closeOnObject(object){
    let sockets = this.watchedObjects[object.netID].sockets;
    console.log(sockets);
    for (let i = sockets.length - 1; i >= 0; i--) {
      let socket = sockets[i];
      console.log("Closing socket " + socket.id);
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
