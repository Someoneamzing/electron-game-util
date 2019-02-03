class GUIElement extends HTMLElement {
  constructor({name, prop, w = 50, h = 20, x = 0, y = 0}){
    super();
    this.name = name;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.attachShadow({mode: 'open'});
    let template = document.getElementById('gui-element-' + this.constructor.elementName);
    if (template) this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.properties = {prop};
    this.gui = null;

  }

  connectedCallback(){
    this.style.top = this.y + "px";
    this.style.left = this.x + "px";
    this.style.width = this.w + "px";
    this.style.height = this.h + "px";
    this.style.position = "absolute";
  }

  setGUI(gui) {
    this.gui = gui;
    this.gui.server.on('gui-prop-change-' + this.name, (prop, oldVal, newVal)=>{
      this.propUpdate(prop, oldVal, this.properties[prop].value(oldVal, newVal))
    })
  }

  serverPropUpdate(prop, oldVal, newVal) {
    this.gui.server.io.to('gui-' + this.gui.name).emit('gui-prop-update-' + this.name, prop, oldVal, newVal);
  }

  propUpdate(prop, oldVal, newVal) {
    ;
  }

  setValue(prop, val) {
    this.propUpdate(prop, undefined, val);
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

GUIElement.Property = class {
  constructor(opts){
    let {value, property, handler = (oldVal, newVal)=>{return newVal}} = opts;
    this.type = value == undefined ? "prop" : "constant";
    this.constant = value;
    this.property = property;
    this.handler = handler.bind(this);
  }

  value(oldVal, newVal){
    return this.type == 'constant' ? this.constant : this.handler(oldVal, newVal);
  }
}

module.exports = GUIElement;
