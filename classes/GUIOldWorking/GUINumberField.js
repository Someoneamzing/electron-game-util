const GUIElement = require("./GUIElement.js");

class GUINumberField extends GUIElement {

  constructor(opts){
    super(opts);
    let {click = null, text = null, min = null, max = null, step = null, input = null} = opts;
    this.getters = {click, input};
  }

  // setGUI(gui){
  //   super.setGUI(gui);
  //   if (this.properties.click) this.on('click', (object)=>{
  //     (this.properties.click.type == 'constant'?this.properties.click.constant:object[this.properties.click.property]).call(object)
  //   })
  //   if (this.properties.input) this.on('input', (object)=>{
  //     (this.properties.input.type == 'constant'?this.properties.input.constant:object[this.properties.input.property]).call(object)// TODO: Fix data transmission for events.
  //   })
  // }

  connectedCallback(){
    super.connectedCallback();
    let input = this.shadowRoot.getElementById("field");
    input.addEventListener('input', (e)=>{
      console.log(input.value);
      if (input.max && input.value > input.max) input.value = input.max;
      if (input.min && input.value < input.min) input.value = input.min;
      input.value = input.step?Math.round(Number(input.value)/Number(input.step)) * Number(input.step):input.value;
    })
  }

  propUpdate(prop, oldVal, newVal) {
    let input = this.shadowRoot.getElementById('field');
    switch (prop){
      case 'min':
        input.setAttribute('min', newVal);
        break;
      case 'max':
        input.setAttribute('max', newVal);
        break;
      case 'step':
        input.setAttribute('step', newVal);
        break;
    };
  }

  static registerTemplate(){
    return "<input type='number' id='field'>";
  }
}

GUINumberField.elementTypes = {};

GUIElement.define('gui-number-field', GUINumberField);

module.exports = GUINumberField;
