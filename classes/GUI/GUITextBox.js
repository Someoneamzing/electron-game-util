const GUIElement = require("./GUIElement.js");

class GUITextBox extends GUIElement {

  connectedCallback(){

  }

  propUpdate(prop, oldVal, newVal) {
    this.shadowRoot.getElementById('text').innerText = newVal;
  }

  static registerTemplate(){
    return "<p id='text'></p>";
  }
}

GUITextBox.elementTypes = {};

GUIElement.define('gui-text-box', GUITextBox);

module.exports = GUITextBox;
