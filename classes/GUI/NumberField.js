const ConnectionManager = require('../ConnectionManager.js');
const uuid = require('uuid/v4');

module.exports = function(connection){
  Element = require('./Element.js')(connection);
  if (module.exports.classMap.has(connection)) {
    return module.exports.classMap.get(connection);
  } else {
    class NumberField extends Element {
      static get getters(){
        return ['placeholder', 'min', 'max'];
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
        let input = this.shadowRoot.getElementById('input');
        if (prop == 'max') {input.max = newVal;input.value = Math.min(Math.max(input.value, input.min), input.max);}
        if (prop == 'min') {input.min = newVal;input.value = Math.min(Math.max(input.value, input.min), input.max);}
        if (prop == 'value') input.value = Number(newVal);
        if (prop == 'placeholder') input.placeholder = newVal;

      }

      connectedCallback(){
        super.connectedCallback();
        let input = this.shadowRoot.getElementById('input');
        input.addEventListener('input', ()=>{
          console.log("New value = " + input.value);
          input.value = Math.min(Math.max(input.value, input.min), input.max);
          this.value = Number(input.value);
        })
      }

      static registerTemplate(){
        return "<input type='number' id='input'>";
      }
    }

    Element.define('gui-number-field', NumberField);
    module.exports.classMap.set(connection, NumberField)

    return NumberField;


  }
}

module.exports.classMap = new Map();
