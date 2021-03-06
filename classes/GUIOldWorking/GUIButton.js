const GUIElement = require("./GUIElement.js");

class GUIButton extends GUIElement {

  constructor(opts){
    super(opts);
    let {click = null, text = null} = opts;
    this.getters = {click, text};

  }

  // setGUI(gui){
  //   super.setGUI(gui);
  //   // if (this.properties.click) this.on('click', (object)=>{
  //   //   (this.properties.click.type == 'constant'?this.properties.click.constant:object[this.properties.click.property]).call(object)
  //   // })
  // }

  propUpdate(prop, oldVal, newVal) {
    switch (prop) {
      case "text":
        this.shadowRoot.getElementById('button').innerText = newVal;
        break;
    }
  }

  static registerTemplate(){
    return "<button type='button' id='button'></button>";
  }
}

GUIButton.elementTypes = {};

GUIElement.define('gui-button', GUIButton);

module.exports = GUIButton;
