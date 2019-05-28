const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  Element = require('./Element.js')(connection);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class TextBox extends Element {
      static get getters(){
        return ['text'];
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
        if (prop == 'text') this.shadowRoot.getElementById('text').innerText = newVal;
      }

      connectedCallback(){
        super.connectedCallback();
      }

      static registerTemplate(){
        return "<p id='text'></p>";
      }
    }

    Element.define('gui-text-box', TextBox);
    module.exports.classMap.set(connection, TextBox)

    return TextBox;


  }
}

module.exports.classMap = new Map();
