const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  Element = require('./Element.js')(connection);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class TextField extends Element {
      static get getters(){
        return ['placeholder'];
      }

      static get setters(){
        return [['value','value']];
      }

      constructor() {
        super();
        this.value = 0;
        // this.propUpdate = this.propUpdate.bind(this);
      }

      propUpdate(prop, oldVal, newVal) {
        console.log(prop, oldVal, newVal);
        if (prop == 'placeholder') this.shadowRoot.getElementById('input').placeholder = newVal;
        if (prop == 'value') this.shadowRoot.getElementById('input').value = newVal;
      }

      connectedCallback(){
        super.connectedCallback();
        let input = this.shadowRoot.getElementById('input');
        input.addEventListener('input', ()=>{
          console.log("New value = " + input.value);
          this.value = input.value;
        })
      }

      static registerTemplate(){
        return "<input type='text' id='input'>";
      }
    }

    Element.define('gui-text-field', TextField);
    module.exports.classMap.set(connection, TextField)

    return TextField;


  }
}

module.exports.classMap = new Map();
