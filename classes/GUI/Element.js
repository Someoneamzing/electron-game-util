const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  console.log(module.exports.classMap.entries());
  module.exports.i ++;
  console.log(module.exports.i);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class Element extends HTMLElement {
      static get getters(){
        return [];
      }

      static get setters(){
        return [];
      }

      static get events(){
        return [];
      }

      constructor() {
        super();
        this.propUpdate = this.propUpdate.bind(this);
        this.handleDOMEvent = this.handleDOMEvent.bind(this);
      }

      connectedCallback(){
        this.gui = this.closest('gui-container');

        this.socketSetterHandlers = {};
        this.socketEventHandlers = {};

        let template = document.getElementById('gui-template-' + this.constructor.elementName);
        if (template) {
          this.attachShadow({mode: 'open'});
          this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        this.style.position = "absolute";
        this.style.width = this.getAttribute('w') + "px";
        this.style.height = this.getAttribute('h') + "px";
        this.style.top = this.getAttribute('y') + "px";
        this.style.left = this.getAttribute('x') + "px";

        this.getters = this.constructor.getters.map(e=>{return {attr: e, value: this.getAttribute(e)}}).reduce((obj, getter)=>{
          if (!getter.value) {
            obj[getter.attr] = null;
            return obj;
          }
          let n = getter.value.indexOf("!");
          let handler = null;
          if (n != -1) {
            handler = getter.value.substring(n + 1);
          }
          obj[getter.attr] = {constant: getter.value.indexOf("::") != 0?getter.value:null, property: getter.value.substring(2,n>2?n:getter.value.length), handler };
          return obj;
        }, {});

        this.setters = this.constructor.setters.map(e=>{return {attr: e[0], value: this.getAttribute(e[0]), localProperty: e[1]}}).reduce((obj, setter)=>{
          if (!setter.value) {
            obj[setter.attr] = null;
            return obj;
          }
          let n = setter.value.indexOf("!");
          let handler = null;
          if (n != -1) {
            handler = setter.value.substring(n);
          }
          obj[setter.attr] = {constant: setter.value.indexOf("::") != 0?setter.value:null, property: setter.value.substring(2,n>2?n:setter.value.length), handler , localProperty: setter.localProperty};
          return obj;
        }, {});

        this.events = this.constructor.events.map(e=>{return {attr: e[0], value: this.getAttribute(e[0]), localName: e[1]}}).reduce((obj, event)=>{
          if (!event.value) {
            opts[event.attr] = null;
            return opts;
          }
          obj[event.attr] = {constant: event.value.indexOf("::") != 0?event.value:null, property: event.value.substring(2), localName: event.localName};
          return obj;
        }, {});


        if (this.gui.server.side == ConnectionManager.SERVER) {
          //---SERVER

          //_________
        } else {
          //---CLIENT
          for (let attr in this.getters){
            let getter = this.getters[attr];
            if (!getter||!getter.constant) {
              // this.gui.server.socket.on('gui-prop-update-' + this.gui.name + '-' + this.id, this.propUpdate);
            } else {
              this.propUpdate(attr, undefined, getter.constant)
            }
          }

          for (let attr in this.constructor.setters) {
            let setter = this.setters[attr];
            if (!setter||!setter.constant) {

            } else {
              this.propUpdate(attr, undefined, setter.constant)
            }
          }
          //_________
        }
      }

      static registerTemplate(){
        return "";
      }

      connect(socket, object) {
        for (let child of this.children) {
          if (child.connect) child.connect(object);
        }

        if (this.gui.server.side == ConnectionManager.SERVER) {
          //---SERVER
          let objectAccessor = this.gui.accessingObjects[object.netID].watchers;
          if (Object.keys(this.setters).length > 0) {

            console.log("Addign setter functionallity to " + this.id);
            this.socketSetterHandlers[socket.id] = (prop, oldVal, newVal) => {
              // console.log(`Recieved prop update from ${socket.id} for object ${object.netID}`);
              this.gui.accessingSockets[socket.id].object[this.setters[prop].property] = newVal;
              for (let toSocket of this.gui.accessingObjects[this.gui.accessingSockets[socket.id].object.netID].sockets) toSocket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, prop, oldVal, newVal)
            }
            socket.on('gui-prop-update-' + this.gui.name + '-' + this.id, this.socketSetterHandlers[socket.id]);
            for (let attr in this.setters) {
              let setter = this.setters[attr];
              if (!setter||setter.constant) continue;
              socket.emit('gui-prop-update-' + this.gui.name + "-" + this.id, attr, undefined, setter.handler?object[setter.handler](setter.property, undefined, object[setter.property]):object[setter.property])
            }
          }
          if (Object.keys(this.events).length > 0) {
            console.log("Adding event functionallity to " + this.id);
            this.socketEventHandlers[socket.id] = (prop, ...data) => {
              // console.log(`Recieved event call from ${socket.id} for object ${object.netID}`);
              this.gui.accessingSockets[socket.id].object[this.events[prop].property](...data);
            }
            socket.on('gui-event-call-' + this.gui.name + '-' + this.id, this.socketEventHandlers[socket.id])
          }
          for (let attr in this.getters) {
            let getter = this.getters[attr];
            if (!getter||getter.constant) continue;
            if (!objectAccessor[getter.property]) {
              objectAccessor[getter.property] = {};
              this.gui.accessingSockets[socket.id].object.watch(getter.property, (prop, oldVal, newVal)=>{
                // console.log("Object property updated... sending update packet");

                for (let id in objectAccessor[prop]) {
                  for (let attr in objectAccessor[prop][id]){
                    objectAccessor[prop][id][attr](prop, oldVal, newVal);
                  }
                }
              })
            }

            if (!objectAccessor[getter.property][socket.id]) objectAccessor[getter.property][socket.id] = {};

            objectAccessor[getter.property][socket.id][attr] = (prop, oldVal, newVal)=>{
              socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, oldVal, getter.handler?object[getter.handler](prop, oldVal, newVal):newVal)
            }

            console.log(objectAccessor);
            console.log("First update for initial data.");
            socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, undefined, getter.handler?object[getter.handler](getter.property, undefined, object[getter.property]):object[getter.property])
          }
          //_________
        } else {
          //---CLIENT
          this.gui.server.socket.on('gui-prop-update-' + this.gui.name + '-' + this.id, this.propUpdate)

          for (let attr in this.setters) {
            let setter = this.setters[attr];
            if (!setter) continue;
            this.watch(setter.localProperty, (prop, oldVal, newVal)=>{
              console.log('Prop updated for ' + prop + '... sending update');
              this.gui.server.socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, oldVal, setter.handler?object[setter.handler](prop, oldVal, newVal):newVal)
            })
            // this.gui.server.socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, undefined, setter.handler?setter.handler(setter.property, undefined, this[setter.localProperty]):this[setter.localProperty])

          }

          for (let attr in this.events) {
            let event = this.events[attr];
            if (!event) continue;
            this.addEventListener(event.localName, this.handleDOMEvent)
          }
          //_________
        }
      }

      handleDOMEvent(e){
        this.gui.server.socket.emit('gui-event-call-' + this.gui.name + '-' + this.id, Object.keys(this.events).find(a=>this.events[a].localName == e.type))
      }

      disconnect(socket){
        for (let child of this.children) {
          if (child.disconnect) child.disconnect(socket);
        }
        if (this.gui.server.side == ConnectionManager.SERVER) {
          //---SERVER
          if (Object.keys(this.setters).length > 0) socket.off('gui-prop-update-' + this.gui.name + '-' + this.id, this.socketSetterHandlers[socket.id])
          if (Object.keys(this.events).length > 0) socket.off('gui-event-call-' + this.gui.name + '-' + this.id, this.socketEventHandlers[socket.id])
          let object = this.gui.accessingSockets[socket.id].object;
          for (let attr in this.getters) {
            if (!this.getters[attr] || this.getters[attr].constant != null) continue;
            let getter = this.getters[attr];
            delete this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][attr]
            if (Object.keys(this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id]).reduce((acc, e)=>{return acc + this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][e].length},0) < 1) delete this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id];
            if (Object.keys(this.gui.accessingObjects[object.netID].watchers[getter.property]).length < 1) {
              object.unwatch(getter.property);
              delete this.gui.accessingObjects[object.netID].watchers[getter.property];
            }
            //this.gui.accessingSockets[socket.id].object.unwatch(this.getters[attr].property);
          }


          delete this.socketSetterHandlers[socket.id]
          //_________
        } else {
          //---CLIENT
          if (Object.keys(this.getters).length > 0) this.gui.server.socket.off('gui-prop-update-' + this.gui.name + '-' + this.id, this.propUpdate);
          for (let attr in this.setters) {
            if (this.setters[attr]) this.unwatch(this.setters[attr].localProperty);
          }
          for (let attr in this.events) {
            if (this.events[attr]) this.removeEventListener(this.events[attr].localName, this.handleDOMEvent);
          }
          //_________
        }
      }

      propUpdate(prop, oldVal, newVal) {
        console.log(prop, oldVal, newVal);
      }

      static define(name, Class) {
        customElements.define(name, Class);
        Class.elementName = name;
        Element.classes.push(Class);
      }

      static registerAll(element){
        for (let Class of Element.classes) {
          let elementTemplate = Class.registerTemplate();
          if (elementTemplate.length > 0) element.insertAdjacentHTML('beforeend', `<template id="gui-template-${Class.elementName}">${elementTemplate}</template>`)
        }
      }
    }

    Element.classes = [];

    Element.define('gui-element', Element);

    module.exports.classMap.set(connection, Element)
    return Element;
  }
}

module.exports.classMap = new Map();

module.exports.i = 0;
