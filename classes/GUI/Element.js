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

      static get clientIPCFns(){
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
        this.socketIPCHandlers = {};
        this.boundAttrs = {};

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

        //getters = {<attr>:{target, constant, property, handler}, ...}
        this.getters = this.constructor.getters.map(e=>{return {attr: e, value: this.getAttribute(e)}}).reduce((obj, getter)=>{
          //If the attr is not declared set the attr to null under object;
          if (!getter.value) {
            obj[getter.attr] = null;
            return obj;
          }
          //Determine if this property has a handler function that should be called when the property changes.
          let n = getter.value.indexOf("!");
          let handler = null;
          if (n != -1) {
            //Get the name of the property that has the handler.
            handler = getter.value.substring(n + 1);
          }
          //Determine the target object/helper
          let t = getter.value.indexOf(".");
          let target = 'object';
          if (t > -1) {
            target = getter.value.substring(2,t);
          }
          obj[getter.attr] = {target,constant: getter.value.indexOf("::") != 0?getter.value:null, property: getter.value.substring(t>2?t+1:2,n>2?n:getter.value.length), handler };
          return obj;
        }, {});

        //setters = {<attr>:{target, constant, property, handler, localProperty}, ...}
        this.setters = this.constructor.setters.map(e=>{return {attr: e[0], value: this.getAttribute(e[0]), localProperty: e[1]}}).reduce((obj, setter)=>{
          if (!setter.value) {
            obj[setter.attr] = null;
            return obj;
          }
          let n = setter.value.indexOf("!");
          let handler = null;
          if (n != -1) {
            handler = setter.value.substring(n + 1);
          }
          let t = setter.value.indexOf(".");
          let target = 'object';
          if (t > -1) {
            target = setter.value.substring(0,t);
          }
          obj[setter.attr] = {target, constant: setter.value.indexOf("::") != 0?setter.value:null, property: setter.value.substring(t>2?t+1:2,n>2?n:setter.value.length), handler , localProperty: setter.localProperty};
          return obj;
        }, {});

        //events = {<attr>:{target, constant, property, handler, localProperty}, ...}
        this.events = this.constructor.events.map(e=>{return {attr: e[0], value: this.getAttribute(e[0]), localName: e[1]}}).reduce((obj, event)=>{
          if (!event.value) {
            opts[event.attr] = null;
            return opts;
          }
          let t = event.value.indexOf(".");
          let target = 'object';
          if (t > -1) {
            target = event.value.substring(0,t);
          }
          obj[event.attr] = {target,constant: event.value.indexOf("::") != 0?event.value:null, property: event.value.substring(t>2?t+1:2), localName: event.localName};
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

      getServerAttr(socket, attr) {
        let getter = this.getters[attr];
        let object = getter.target == 'object'?this.gui.accessingSockets[socket.id].object:this.gui.accessingSockets[socket.id].helpers[getter.target];
        return getter.handler?object[getter.handler](getter.property, undefined, object[getter.property]):(getter.constant != null? getter.constant : object[getter.property])
      }

      connect(socket, object, helpers) {
        //Notify children of connection.
        for (let child of this.children) {
          if (child.connect) child.connect(object);
        }

        if (this.gui.server.side == ConnectionManager.SERVER) {
          //---SERVER
          if (Object.keys(this.setters).length > 0) {
            //Add setter fuctionality.

            console.log("Adding setter functionallity to " + this.id);
            this.socketSetterHandlers[socket.id] = (prop, oldVal, newVal) => {
              console.log(`Recieved prop update from ${socket.id} for object ${object.netID}`);
              let target = this.setters[prop].target == 'object'?this.gui.accessingSockets[socket.id].object:this.gui.accessingSockets[socket.id].helpers[this.setters[prop].target];
              target[this.setters[prop].property] = newVal;
              for (let toSocket of this.gui.accessingObjects[target.netID].sockets) toSocket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, prop, oldVal, newVal)
            }
            socket.on('gui-prop-update-' + this.gui.name + '-' + this.id, this.socketSetterHandlers[socket.id]);
            for (let attr in this.setters) {
              let setter = this.setters[attr];
              let target = setter.target == 'object'?object:this.gui.accessingSockets[socket.id].helpers[setter.target];
              if (!setter||setter.constant) continue;
              socket.emit('gui-prop-update-' + this.gui.name + "-" + this.id, attr, undefined, setter.handler?target[setter.handler](setter.property, undefined, target[setter.property]):target[setter.property])
            }
          }
          if (Object.keys(this.events).length > 0) {
            console.log("Adding event functionallity to " + this.id);
            this.socketEventHandlers[socket.id] = (prop, ...data) => {
              console.log(`Recieved event call from ${socket.id} for object ${object.netID}`);
              (this.events[prop].target == 'object'?this.gui.accessingSockets[socket.id].object:this.gui.accessingSockets[socket.id].helpers[this.events[prop].target])[this.events[prop].property](...data);
            }
            socket.on('gui-event-call-' + this.gui.name + '-' + this.id, this.socketEventHandlers[socket.id])
          }
          if (this.constructor.clientIPCFns.length > 0) {
            this.socketIPCHandlers[socket.id] = ((method, ...data) => {
              if (!this.constructor.clientIPCFns.includes(method)) {
                console.warn("Recieved IPC call for non-existant / unregistered method '" + method + "'. Could be a bug in a GUI element or a possible attempted ACE attack. Check the origin of this call to double check.");
                return;
              }
              this[method](socket, ...data);
            }).bind(this)
            socket.on('gui-ipc-call-' + this.gui.name + '-' + this.id, this.socketIPCHandlers[socket.id]);
          }
          for (let attr in this.getters) {
            let getter = this.getters[attr];
            let target = getter.target=='object'?object:helpers[getter.target];
            let objectAccessor = this.gui.accessingObjects[target.netID].watchers;

            if (!getter||getter.constant) continue;
            if (!objectAccessor[getter.property]) {
              objectAccessor[getter.property] = {};
              let property = getter.property;
              if (target.constructor.getNetProps().includes(getter.property)) property = target.constructor.getFinalProp(getter.property);
              console.log(getter, property);
              target.watch(property, (prop, oldVal, newVal)=>{
                console.log("Object property updated... sending update packet");

                for (let id in objectAccessor[getter.property]) for (let elemID in objectAccessor[getter.property][id]) for (let attr in objectAccessor[getter.property][id][elemID]){
                    objectAccessor[getter.property][id][elemID][attr](getter.property, oldVal, newVal);
                }
              })
            }

            if (!objectAccessor[getter.property][socket.id]) objectAccessor[getter.property][socket.id] = {};

            if (!objectAccessor[getter.property][socket.id][this.id]) objectAccessor[getter.property][socket.id][this.id] = {};

            objectAccessor[getter.property][socket.id][this.id][attr] = (prop, oldVal, newVal)=>{
              socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, oldVal, getter.handler?target[getter.handler](prop, oldVal, newVal):newVal)
            }

            console.log(objectAccessor);
            console.log("First update for initial data.");
            socket.emit('gui-prop-update-' + this.gui.name + '-' + this.id, attr, undefined, getter.handler?target[getter.handler](getter.property, undefined, target[getter.property]):target[getter.property])
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

          for (let ipcMethod of this.constructor.clientIPCFns) {
            if (typeof this[ipcMethod] !== 'function') {
              throw new Error("Element (GUI): Attempted to bind non-existant / non-function property to ipc call on property: '" + ipcMethod + "'.");
            }
            this[ipcMethod] = (...data)=>{
              this.gui.server.socket.emit('gui-ipc-call-' + this.gui.name + '-' + this.id, ipcMethod, ...data);
            }
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
          if (this.constructor.clientIPCFns.length > 0) {
            socket.off('gui-ipc-call-' + this.gui.name + '-' + this.id, this.socketIPCHandlers[socket.id])
            delete this.socketIPCHandlers[socket.id];
          }
          for (let attr in this.getters) {
            if (!this.getters[attr] || this.getters[attr].constant != null) continue;
            let getter = this.getters[attr];
            let object = getter.target == 'object'?this.gui.accessingSockets[socket.id].object:this.gui.accessingSockets[socket.id].helpers[getter.target];
            delete this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][this.id][attr]
            if (Object.keys(this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][this.id]).reduce((acc, e)=>{return acc + this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][this.id][e].length},0) < 1) delete this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][this.id];
            if (Object.keys(this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id]).reduce((acc, e)=>{return acc + this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id][e].length},0) < 1) delete this.gui.accessingObjects[object.netID].watchers[getter.property][socket.id];
            if (Object.keys(this.gui.accessingObjects[object.netID].watchers[getter.property]).length < 1) {
              object.unwatch(object.constructor.getNetProps().includes(getter.property)?object.constructor.netPropMap.get(getter.property):getter.property);
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
          for (let ipcMethod of this.constructor.clientIPCFns) {
            if (typeof this[ipcMethod] != 'function') throw new Error("Attempted to unbind ipc call from non-existant / non-function property: '" + ipcMethod + "'")
            this[ipcMethod] = noop;
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
