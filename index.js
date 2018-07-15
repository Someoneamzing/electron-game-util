let electron;
global["$"] = require('jquery');
try {
  electron = require('electron');
  //if (!process.versions.hasOwnProperty('electron')/*||process.versions.electron*/||process.type != 'renderer') throw new Error();
} catch (e) {
  //throw new Error("Game Util requires Electron. Ensure that electron is installed and is working correctly." + e.message)
  ;
}

const uuid = require('uuid/v4');

const fs = require('fs');
const path = require('path');

const Point = require('./classes/Point.js');
const {Rectangle, Circle, Line} = require('./classes/Shapes.js');
const Vector = require('./classes/Vector.js');
const QueryResult = require('./classes/QueryResult.js');
const QuadTree = require('./classes/QuadTree.js');
const Camera = require('./classes/Camera.js');
const GameCanvas = require('./classes/GameCanvas.js');
const Matrix = require('./classes/Matrix.js');
const NetworkWrapper = require('./classes/NetworkWrapper.js');
const Sprite = require('./classes/Sprite.js');
const TrackList = require('./classes/TrackList.js');
const ConnectionManager = require('./classes/ConnectionManager.js');
const Server = require('./classes/Server.js');
const Client = require('./classes/Client.js');
const CollisionGroup = require('./classes/CollisionGroup.js');
const GameLoop = require('./classes/GameLoop.js');
const ControlInterface = require('./classes/ControlInterface.js');
const {clamp, sum, average, shareOne} = require('./classes/MathUtil.js');



module.exports = {clamp, sum, average, shareOne, Camera, Circle, Client, CollisionGroup, ConnectionManager, ControlInterface, GameCanvas, GameLoop, Line, Matrix, NetworkWrapper, Point, QuadTree, QueryResult, Rectangle, Server, Sprite, TrackList, Vector};
