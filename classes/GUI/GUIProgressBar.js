const GUIElement = require("./GUIElement.js");

class GUIProgressBar extends GUIElement {

  constructor(opts){
    super(opts);
    let {max, progress} = opts;
    this.properties = {max, progress};
  }

  propUpdate(prop, oldVal, newVal) {
    switch (prop) {
      case "max":
        this.shadowRoot.getElementById('bar').max = newVal;
        break;
      case "progress":
        this.shadowRoot.getElementById('bar').value = newVal;
        break;
    }
  }

  static registerTemplate(){
    return "<progress id='bar'></progress>";
  }
}

GUIProgressBar.elementTypes = {};

GUIElement.define('gui-progress-bar', GUIProgressBar);

module.exports = GUIProgressBar;
