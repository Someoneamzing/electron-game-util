class GUIElement extends HTMLElement {
  constructor(name, prop){
    super();
    this.name = name;
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('gui-element-' + this.constructor.elementName);
    if (template) this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.propName = prop;
    this.gui = null;

  }

  connectedCallback(){

  }

  setGUI(gui) {
    this.gui = gui;
    this.gui.server.on('gui-prop-change-' + this.name, this.propUpdate.bind(this))
  }

  serverPropUpdate(prop, oldVal, newVal) {
    this.gui.server.io.to('gui-' + this.gui.name).emit('gui-prop-update-' + this.name, prop, oldVal, newVal);
  }

  propUpdate(prop, oldVal, newVal) {
    ;
  }

  setValue(val) {
    this.propUpdate(this.propName, undefined, val);
  }

  static registerTemplate(){
    ;
  }

  static define(name, Class) {
    customElements.define(name, Class);
    Class.elementName = name;
    GUIElement.elementTypes[name] = Class;
  }

  static registerAll(element){
    for (let name in GUIElement.elementTypes) {
      let elementClass = GUIElement.elementTypes[name];
      console.log(name, elementClass);
      let template = elementClass.registerTemplate();
      if (template) {
        console.log(template);
        element.insertAdjacentHTML('beforeend',"<template id='gui-element-" + name + "'>" + template + "</template>");
      }
    }
  }
}

GUIElement.elementTypes = {};

GUIElement.define('gui-element', GUIElement);

module.exports = GUIElement;
