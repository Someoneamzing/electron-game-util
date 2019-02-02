const uuid = require('uuid/v4');

gTimer = new Map();

class Timer {
  constructor(namespace){
    this.namespace = namespace || uuid();
  }

  static makeInterCallback(data, origTime) {
    return ()=>{
      if (data.time <= origTime) {
        data.cb(...data.userData);
        gTimer.delete(data.name);
      } else {
        data.time = data.time - origTime;// TODO:  Reset time and manage timeout stuff.
        console.log("Timer: next time for " + data.name + ": " + data.time);
        data.interCb = Timer.makeInterCallback(data, data.time);
        data.timer = setTimeout(data.interCb, data.time);
      }
    }
  }

  newTimer(...rest) {
    let name;
    let time;
    let cb;
    let userData;
    if (typeof rest[0] == "string") {
      name = this.namespace + ":" + rest[0];
      time = rest[1];
      cb = rest[2];
      userData = rest.slice(3);
    } else {
      name = this.namespace + ":" + uuid();
      time = rest[0];
      cb = rest[1];
      userData = rest.slice(2);
    }
    if (isNaN(time)) throw new Error("Timer: time must be a valid number. Got " + time.constructor.name);
    if (typeof cb != 'function') {
      throw new Error("Timer: (Performance Watchdog) The timer '" + name + "' was registered with no callback.");
    }
    let data = { cb, time, name, userData}
    let interCb = Timer.makeInterCallback(data, time);
    data.timer = setTimeout(interCb, time),
    data.interCb = interCb;
    gTimer.set(name, data);
    return name;
  }

  delayTimer(name, time) {
    let timerData = gTimer.get(name);
    if (timerData) {
      timerData.time += time;

    } else {
      throw new Error("Timer: Could not find timer by name " + name);
    }
  }

  cancelTimer(name) {
    let timerData = gTimer.get(name);
    if (timerData) {
      cancelTimeout(timerData.timer);
      gTimer.delete(name);
    } else {
      return false;
    }
  }
}

module.exports = Timer;
