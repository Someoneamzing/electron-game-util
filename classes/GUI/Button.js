const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  Element = require('./Element.js')(connection);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class Button extends Element {
      static get getters(){
        return ['text'];
      }

      static get setters(){
        return [];
      }

      static get events(){
        return [['click', 'click']];
      }

      constructor() {
        super();
        // this.propUpdate = this.propUpdate.bind(this);
      }

      propUpdate(prop, oldVal, newVal) {
        console.log(prop, oldVal, newVal);
        if (prop == 'text') this.shadowRoot.getElementById('button').innerText = newVal;
      }

      connectedCallback(){
        super.connectedCallback();
      }

      static registerTemplate(){
        return "<button type='button' id='button'></button>";
      }
    }

    Element.define('gui-button', Button);
    module.exports.classMap.set(connection, Button)

    return Button;


  }
}

module.exports.classMap = new Map();
