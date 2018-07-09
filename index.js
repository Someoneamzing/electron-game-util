let electron;
global["$"] = require('jquery');
try {
  electron = require('electron');
  if (!process.versions.hasOwnProperty('electron')/*||process.versions.electron*/||process.type != 'renderer') throw new Error();
} catch (e) {
  throw new Error("Game Util requires Electron. Ensure that electron is installed and is working correctly." + e.message)
}

const uuid = require('uuid/v4');

const fs = require('fs');
const path = require('path');

const Point = require('./classes/Point.js');
const Rectangle = require('./classes/Rectangle.js');
const Circle = require('./classes/Circle.js');
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


function clamp(n,low,high) {
  return Math.min(Math.max(n,low),high);
}

function sum(list) {
  if (list[0] instanceof Point) {
    let totalx = 0;
    let totaly = 0;
    for (let p of list) {
      totalx += p.x;
      totaly += p.y;
    }
    return new Point(totalx,totaly);
  } else {
    let total = 0;
    for (let p of list) {
      total += p;
    }
    return total;
  }
}

function average(list){
  if (list[0] instanceof Point) {
    let sumP = sum(list);
    return new Point(sumP.x / list.length, sumP.y / list.length);
  } else {
    return sum(list)/list.length;
  }
}

exports = {clamp, sum, average, Camera, Circle, ConnectionManager, GameCanvas, Matrix, NetworkWrapper, Point, QuadTree, QueryResult, Rectangle, Server, Sprite, TrackList, Vector};
