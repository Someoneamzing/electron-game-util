
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
        this.helpers = this.getAttribute('helpers')?this.getAttribute('helpers').split(" "):[];
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

      isOpenForSocket(socket) {
        return socket.id in this.accessingSockets;
      }

      open(socket, object, helpers = {}){
        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER
          console.log(`GUI ${this.name} opening on socket ${socket.id} for object ${object.netID}`);
          //Sanity check for debugging purposes. Helper should not be there if it is not used. Missing used helpers will cause errors.

          //Handle clients disconecting from GUI.
          let disconnectHandler = (()=>{
            this.close(socket);
          }).bind(this)

          object.once('remove', disconnectHandler);

          for (let helper of this.helpers) {
            if (!(helper in helpers)) {
              console.warn("Missing object helper '" + helper + "' on GUI '" + this.name + "'")
            } else {
              helpers[helper].once('remove', disconnectHandler);
            }
          }
          //Add socket object and handler to the accessingSockets map. Provides connection between sockets and their objects and helpers.
          this.accessingSockets[socket.id] = {socket, object, helpers, disconnectHandler};
          //If the requested object is not already being listened to, add the entry in the accessing object map. Provides conection between an accessedObject and eventually helpers and the sockets looking at them as well as the observed properties.
          if (!this.accessingObjects[object.netID]) {
            this.accessingObjects[object.netID] = {object, sockets: [socket], watchers: {}};
          } else {
            //Otherwise just add the current socket to the list.
            this.accessingObjects[object.netID].sockets.push(socket)
          }
          //Add all the helpers to the accessingObjects map as they need to be recorded and should have the same behaviour as object.
          for (let helperName of this.helpers) {
            let helper = helpers[helperName];
            if (!this.accessingObjects[helper.netID]) {
              this.accessingObjects[helper.netID] = {object: helper, sockets: [socket], watchers: {}};
            } else {
              //Otherwise just add the current socket to the list.
              this.accessingObjects[helper.netID].sockets.push(socket)
            }
          }
          //If the client disconnects from the server close the GUI to prevent access to non-existant sockets.
          socket.on('disconnect', this.accessingSockets[socket.id].disconnectHandler);
          //Notify the client that the gui has been requested to be opened.
          socket.emit('gui-open-' + this.name);

          //_________
        } else {
          //---CLIENT
          this.removeAttribute('hidden');
          //_________
        }
        //Tell the children to open with the passed parameters.
        for (let child of this.children) {
          //Check if the child has a connect() fuction available. There is the possibility that an element may be a regular HTMLElement.
          if (child.connect) child.connect(socket, object, helpers);
        }
      }

      close(socket){
        //Notify all children of the disconnect.
        for (let child of this.children) {
          if (child.disconnect) child.disconnect(socket);
        }
        if (this.server.side == ConnectionManager.SERVER) {
          //---SERVER
          //Stop listening to the disconnect event as the GUI is closed.
          socket.off('disconnect', this.accessingSockets[socket.id].disconnectHandler);

          //Remove the 'remove' listeners
          this.accessingSockets[socket.id].object.off('remove', this.accessingSockets[socket.id].disconnectHandler);
          for (let helper in this.accessingSockets[socket.id].helpers) {
            this.accessingSockets[socket.id].helpers[helper].off('remove', this.accessingSockets[socket.id].disconnectHandler);
          }
          //Tell the client to close the GUI.
          socket.emit('gui-close-' + this.name);
          //Get the objectAccessor descriptor to remove the current socket from the map.
          let objectAccessor = this.accessingObjects[this.accessingSockets[socket.id].object.netID];
          objectAccessor.sockets.splice(objectAccessor.sockets.indexOf(socket), 1)
          //If there are no more sockets connected remove the object from the map as it is no longer being watched.
          if (objectAccessor.sockets.length < 1) delete this.accessingObjects[this.accessingSockets[socket.id].object.netID];
          //Remove the current socket from the socket map.
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

      static closeAllOnObject(object){
        if (connection.server.side == ConnectionManager.SERVER) {
          //---SERVER
          for (let guiName of GUI.list) {
            let gui = GUI.list[guiName];
            let objectAccessor = gui.accessingObjects[object.netID];
            if (!objectAccessor) continue;
            for (let i = objectAccessor.sockets.length - 1; i >= 0; i --) {
              gui.close(objectAccessor.sockets[i]);
            }
          }

          //_________
        } else {
          //---CLIENT

          //_________
        }
      }

      static closeAllOnSocket(socket){
        if (connection.server.side == ConnectionManager.SERVER) {
          //---SERVER
          for (let guiName in GUI.list) {
            let gui = GUI.list[guiName];
            if (socket.id in gui.accessingSockets) gui.close(socket);
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
