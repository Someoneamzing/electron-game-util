# Using the GUI API
> GUIs make a major part of a game. They allow complex interaction with the GameObjects and this API makes networked GUIs simple to develop.

## Making a GUI
GUIs are defined in two parts:
1. A HTML file describing their structure.
2. A JS file that tells the app where to find the HTML and where in the DOM they should be placed.

The HTML file defines the elements that make up a GUI. For example:
```{html}
<gui-container name="counter" width="600" height="400">
  <gui-progress-bar id="bar" placeholder="::counter" value="::counter" max="::resetTime" color="::counter!counterColor" x="15" y="15" w="200" h="20"></gui-progress-bar>
  <gui-number-field placeholder="Reset Time" value="::resetTime" id="field" min="0" max="1000" x="15" y="45"></gui-number-field>
  <gui-button id="reset" text="Reset" click="::reset" x="15" y="75"></gui-button>
</gui-container>
```
Note the lack of `<!DOCTYPE html>`, `<html>` and `<body>` tags in the file. This is because we are defining a section that goes into a pre-existing html document and those tags are already there.

There are a few things to note about the different elements:
1. The elements are all custom HTML elements however this does not need to be the case.
2. Attributes are the main way of defining behaviour in a GUI.
3. There are several syntaxes for defining attributes on GUIElements.

As the first point states there are custom `GUIElements` that have special behaviour in GUIs. These elements are predefined but you can create custom ones yourself. This will be covered later. For now there are 5 predefined elements you can use:
- `<gui-text-box>`: Acts as a simple `<p>` tag that displays dynamic text from a variable.
- `<gui-text-field>`: A text entry line that can be used to set the contents of a variable.
- `<gui-number-field>`: Same as aa `<gui-text-field>` but only allows numeric data to be entered.
- `<gui-progress-bar>`: A visual progess bar that displays a variable as a percentage between a min and max.
- `<gui-button>`: A button that triggers a function server-side when clicked.

Attributes are the main way of defining behaviour of an element. The syntax is as follows:
| Syntax | Name | Use |
|--------|------|-----|
| attribute="value" | Static value assignment | Sets the attribute to a static value as stated between the quotes. |
| attribute="::variableName" | Dynamic variable assignment | Sets the attribute to the value of a variable that will update whenever the property changes. |
| attribute="!handlerFunction::variableName" | Dynamic variable with onChange handler | Sets the attribute to the output of a function called every time the variable changes. |

There are three types of attributes an element can have:
1. Getter: This is the most basic. It is set to one of the above syntaxes and sets its property to the value of the result.
2. Setter: This type is often used for input value attributes. Whenever the attribute changes the variable identified by the attribute definition will be set to the attribute's value.
3. Event: This type specifies a function to call when an event on the client-side occurs, e.g. A button click, or a form submission. 
