const GUIElement = require("./GUIElement.js");

class GUITextField extends GUIElement {

  constructor(opts){
    super(opts);
    let {click = null, input = null} = opts;
    this.getters = {click, input};

  }

  // setGUI(gui){
  //   super.setGUI(gui);
  //   if (this.properties.click) this.on('click', (object)=>{
  //     (this.properties.click.type == 'constant'?this.properties.click.constant:object[this.properties.click.property]).call(object)
  //   })
  //   if (this.properties.input) this.on('input', (object)=>{
  //     (this.properties.input.type == 'constant'?this.properties.input.constant:object[this.properties.input.property]).call(object)
  //   })
  // }

  propUpdate(prop, oldVal, newVal) {
    ;
  }

  static registerTemplate(){
    return "<input type='text' id='field'>";
  }
}

GUITextField.elementTypes = {};

GUIElement.define('gui-text-field', GUITextField);

module.exports = GUITextField;
