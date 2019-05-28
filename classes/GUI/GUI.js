
/**
  *  'gui-open-${name}' open the gui with that name
  *  'gui-close-${name}' close the gui with that name
  *  'gui-prop-update-${guiName}-${elementId}' update a property on the gui's element
  *  ''
  */

const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');
const fs = require('fs');

module.exports = function(connection){
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class GUI extends HTMLElement {

      connectedCallback(){
        this.name = this.getAttribute('name') || uuid();
        this.w = this.getAttribute('width');
        this.h = this.getAttribute('height');
        this.accessingSockets = {};
        this.accessingObjects = {};

        this.style.position = "fixed";
        this.style.left = "50%";
        this.style.top = "50%";
        this.style.width = this.w + "px";
        this.style.height = this.h + "px";
        this.style.transform = "translate(-50%, -50%)";
        this.style.zIndex = "6";
        this.style.background = "whitesmoke";

        this.server = connection.server;

        this.setAttribute('hidden', '');

        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER

          //_________
        } else {
          //---CLIENT
          this.server.socket.on('gui-open-' + this.name, this.open.bind(this));
          this.server.socket.on('gui-close-' + this.name, this.close.bind(this));
          //_________
        }

        GUI.list[this.name] = this;
      }

      open(socket, object){
        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER
          console.log(`GUI ${this.name} opening on socket ${socket.id} for object ${object.netID}`);
          let disconnectHandler = ()=>{
            this.close(socket);
          }
          this.accessingSockets[socket.id] = {socket, object, disconnectHandler};
          if (!this.accessingObjects[object.netID]) {
            this.accessingObjects[object.netID] = {object, sockets: [socket], watchers: {}};
          } else {
            this.accessingObjects[object.netID].sockets.push(socket)
          }
          socket.on('disconnect', this.accessingSockets[socket.id].disconnectHandler);
          socket.emit('gui-open-' + this.name);

          //_________
        } else {
          //---CLIENT
          this.removeAttribute('hidden');
          //_________
        }
        for (let child of this.children) {
          if (child.connect) child.connect(socket, object);
        }
      }

      close(socket){
        for (let child of this.children) {
          if (child.disconnect) child.disconnect(socket);
        }
        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER

          socket.off('disconnect', this.accessingSockets[socket.id].disconnectHandler);
          socket.emit('gui-close-' + this.name);
          let objectAccessor = this.accessingObjects[this.accessingSockets[socket.id].object.netID];
          objectAccessor.sockets.splice(objectAccessor.sockets.indexOf(socket), 1)
          if (objectAccessor.sockets.length < 1) delete this.accessingObjects[this.accessingSockets[socket.id].object.netID];
          delete this.accessingSockets[socket.id];
          //_________
        } else {
          //---CLIENT
          this.setAttribute('hidden', '');
          //_________
        }
      }

      closeOnObject(object) {
        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER
          console.log(this);
          let objectAccessor = this.accessingObjects[object.netID];
          if (!objectAccessor) return;
          for (let i = objectAccessor.sockets.length - 1; i >= 0; i --) {
            this.close(objectAccessor.sockets[i]);
          }
          //_________
        } else {
          //---CLIENT

          //_________
        }
      }

      static loadGUIsFromFile(absoluteFilePath, destination) {
        let data = fs.readFileSync(absoluteFilePath, 'utf-8');
        let templates = document.createElement('div');
        GUI.Element.registerAll(templates);
        destination.append(templates);
        destination.insertAdjacentHTML('beforeend', data);
        // if (connection.side == ConnectionManager.SERVER) {
        //   destination.querySelectorAll('gui-container').forEach((e)=>{console.log(e);e.connectedCallback();})
        // }
      }
    }

    GUI.list = {};

    customElements.define('gui-container', GUI);
    GUI.Element = require('./Element.js')(connection);
    GUI.TextBox = require('./TextBox.js')(connection);
    GUI.TextField = require('./TextField.js')(connection);
    GUI.NumberField = require('./NumberField.js')(connection);
    GUI.Button = require('./Button.js')(connection);
    GUI.ProgressBar = require('./ProgressBar.js')(connection);
    module.exports.classMap.set(connection, GUI)

    return GUI;
  }
}

module.exports.classMap = new Map();
