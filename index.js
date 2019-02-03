let electron;
// global["$"] = require('jquery');
try {
  electron = require('electron');
  //if (!process.versions.hasOwnProperty('electron')/*||process.versions.electron*/||process.type != 'renderer') throw new Error();
} catch (e) {
  //throw new Error("Game Util requires Electron. Ensure that electron is installed and is working correctly." + e.message)
  ;
}

if (!Object.prototype.watch) {
  Object.defineProperties(Object.prototype, {
    watch: {
      value: function(prop, handler){
          var desc = Object.getOwnPropertyDescriptor(this, prop);
          var newGet;
          var newSet;
          //these cases make little sense, so do nothing we won't be watching readonly descriptors
          if (!desc.configurable
            || (desc.value === undefined && !desc.set)
            || desc.writable === false)
            return;

          if (desc.value !== undefined){
            var val = desc.value;
            newGet = function(){
              return val;
            };
            newSet = function(newVal){
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
              val = handler.call(this, prop, val, newVal);
              desc.set.call(this, val);
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
          var desc = Object.getOwnPropertyDescriptor(this, prop);
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
      }
  });
}

const uuid = require('uuid/v4');

const fs = require('fs');
const path = require('path');

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
const GUIElement = require('./classes/GUI/GUIElement.js');
const GUITextBox = require('./classes/GUI/GUITextBox.js');
const GUIProgressBar = require('./classes/GUI/GUIProgressBar.js');
const {clamp, sum, average, shareOne} = require('./classes/MathUtil.js');



module.exports = {clamp, sum, average, shareOne, Camera, Circle, Client, ClientManager, ClientTrackList, CollisionGroup, ConnectionManager, ControlInterface, GameCanvas, GameObject, GameLoop, GUI, GUIElement, GUITextBox, GUIProgressBar, Line, MathSet, Matrix, NavMesh, NetworkWrapper, Point, Polygon, QuadTree, QueryResult, Rectangle, RectangleClickRegion, Server, Sprite, Timer: OutTimer,  TrackList, Vector};
