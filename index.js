let electron;
// global["$"] = require('jquery');
try {
  electron = require('electron');
  //if (!process.versions.hasOwnProperty('electron')/*||process.versions.electron*/||process.type != 'renderer') throw new Error();
} catch (e) {
  //throw new Error("Game Util requires Electron. Ensure that electron is installed and is working correctly." + e.message)
  ;
}

const EventEmitter = require('events');



if (!Object.prototype.watch) {

  Object.defineProperties(Object.prototype, {
    watch: {
      value: function(prop, handler){
          var desc = Object.getPropertyDescriptor(this, prop);
          console.log("Watching property " + prop  + " on: ", this);
          var newGet;
          var newSet;
          //these cases make little sense, so do nothing we won't be watching readonly descriptors
          if (!desc.configurable
            || (desc.value === undefined && !desc.set)
            || desc.writable === false)
            return;
          console.log("Not readonly");
          if (desc.value !== undefined){
            var val = desc.value;
            newGet = function(){
              return val;
            };
            newSet = function(newVal){
              if (newVal == val) return;
              let possReturn = handler.call(this, prop, val, newVal);
              val = possReturn !== undefined ? possReturn : newVal;
            };
            //let's leverage the setter to store initial information to enable "unwatch"
            newSet._watchHelper = {
              initialType: "dataDescriptor"
            };
          } else {
            newGet = desc.get;
            newSet = function(newVal){
              let possReturn = handler.call(this, prop, val, newVal);

              desc.set.call(this, possReturn !== undefined ? possReturn : newVal);
            };
            newSet._watchHelper = {
              initialType: "accessorDescriptor",
              oldDesc: desc
            };
          }
          Object.defineProperty(this, prop, {
            get: newGet,
            set: newSet,
            configurable: true,
            enumerable: desc.enumerable
          });
        },
        enumerable: false
      },
      unwatch: {
        value: function(prop){
          var desc = Object.getPropertyDescriptor(this, prop);
          if (desc.set._watchHelper){
            if(desc.set._watchHelper.initialType == "dataDescriptor"){
              Object.defineProperty(this, prop, {
                value: this[prop],
                enumerable: desc.enumerable,
                configurable: true,
                writable: true
              });
            }
            else{
              Object.defineProperty(this, prop, {
                get: desc.get,
                set: desc.set._watchHelper.oldDesc.set,
                enumerable: desc.enumerable,
                configurable: true
              });
            }
          }
        },
        enumerable: false
      },
      getPropertyDescriptor: {
        value: function (o, name) {
          let proto = o, descriptor;
          while (proto && !(
            descriptor = Object.getOwnPropertyDescriptor(proto, name))
          ) proto = proto.__proto__;
          return descriptor;
        },
        enumerable: false
      }
  });
}

const uuid = require('uuid/v4');

const fs = require('fs');
const path = require('path');

const Color = require('./classes/Color.js');
const Gradient = require('./classes/Gradient.js');
const Point = require('./classes/Point.js');
const {Rectangle, Circle, Line, Polygon} = require('./classes/Shapes.js');
const {RectangleClickRegion} = require('./classes/ClickHandlers.js');
const Vector = require('./classes/Vector.js');
const OutTimer = require('./classes/Timer.js');
const QueryResult = require('./classes/QueryResult.js');
const QuadTree = require('./classes/QuadTree.js');
const Camera = require('./classes/Camera.js');
const GameCanvas = require('./classes/GameCanvas.js');
const GameObject = require('./classes/GameObject.js');
const Matrix = require('./classes/Matrix.js');
const NavMesh = require('./classes/NavMesh.js');
const NetworkWrapper = require('./classes/NetworkWrapper.js');
const Sprite = require('./classes/Sprite.js');
const TrackList = require('./classes/TrackList.js');
const ClientTrackList = require('./classes/ClientTrackList.js');
const ClientManager = require('./classes/ClientManager.js');
const ConnectionManager = require('./classes/ConnectionManager.js');
const Server = require('./classes/Server.js');
const Client = require('./classes/Client.js');
const CollisionGroup = require('./classes/CollisionGroup.js');
const GameLoop = require('./classes/GameLoop.js');
const ControlInterface = require('./classes/ControlInterface.js');
const MathSet = require('./classes/MathSet.js');
const GUI = require('./classes/GUI/GUI.js');
// const GUIElement = require('./classes/GUI/GUIElement.js');
// const GUITextBox = require('./classes/GUI/GUITextBox.js');
// const GUIProgressBar = require('./classes/GUI/GUIProgressBar.js');
// const GUIButton = require('./classes/GUI/GUIButton.js');
// const GUITextField = require('./classes/GUI/GUITextField.js');
// const GUINumberField = require('./classes/GUI/GUINumberField.js');
const {clamp, sum, average, shareOne} = require('./classes/MathUtil.js');

global.noop = ()=>{};
//, GUIElement, GUITextBox, GUITextField, GUINumberField, GUIProgressBar, GUIButton
module.exports = {clamp, sum, average, shareOne, Camera, Circle, Client, ClientManager, ClientTrackList, CollisionGroup, Color, ConnectionManager, ControlInterface, GameCanvas, GameObject, GameLoop, Gradient, GUI, Line, MathSet, Matrix, NavMesh, NetworkWrapper, Point, Polygon, QuadTree, QueryResult, Rectangle, RectangleClickRegion, Server, Sprite, Timer: OutTimer,  TrackList, Vector};
