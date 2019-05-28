const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  Element = require('./Element.js')(connection);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class ProgressBar extends Element {
      static get getters(){
        return ['placeholder', 'max', 'value', 'color', 'background'];
      }

      static get setters(){
        return [];
      }

      constructor() {
        super();
        // this.propUpdate = this.propUpdate.bind(this);
      }

      propUpdate(prop, oldVal, newVal) {
        console.log(prop, oldVal, newVal);
        if (prop == 'max') {this.max = newVal;this.value = this._value;}
        if (prop == 'value') this.value = Number(newVal);
        if (prop == 'placeholder') this.placeholder = newVal;
        if (prop == 'color') this.color = newVal;
        if (prop == 'background') this.background = newVal;

      }

      get value() {
        return this._value;
      }

      set value(val) {
        this.shadowRoot.getElementById('bar').style.width = (Math.min(Math.max(val, 0), this.max) / this.max) * 100 + "%";
        this._value = val;
      }

      get color(){
        return this.shadowRoot.getElementById('bar').style.backgroundColor;
      }

      set color(val){
        return this.shadowRoot.getElementById('bar').style.backgroundColor = val;
      }

      get background(){
        return this.shadowRoot.getElementById('bar-container').style.backgroundColor;
      }

      set background(val){
        return this.shadowRoot.getElementById('bar-container').style.backgroundColor = val;
      }

      set placeholder(val) {
        this.shadowRoot.getElementById('placeholder').innerText = val;
      }

      get placeholder() {
        return this.shadowRoot.getElementById('placeholder').innerText;
      }

      connectedCallback(){
        super.connectedCallback();
      }

      static registerTemplate(){
        return "<div id='bar-container' style='position: relative; height: 100%; background-color: lightgrey;'><div id='bar' style='background-color: lime; height: 100%; width: 0%'></div><span id='placeholder' style='position: absolute; top: 0; left: 0; width: 100%; text-align: center;'></span></div>";
      }
    }

    Element.define('gui-progress-bar', ProgressBar);
    module.exports.classMap.set(connection, ProgressBar)

    return ProgressBar;


  }
}

module.exports.classMap = new Map();
