# Class: GUIElement
> Represents a part of a GUI. The consumer of properties and the main way of presenting info to a user.

```
class GUI(String name, Number w, Number h, Number x, Number h) extends HTMLElement implements EventEmitter
```
The GUIElement class represents elements of a GUI on the client and provides methods for interacting with the client's visuals from the server.

## Parameters
| Parameter | Type      | Description |
|-----------|-----------|-------------|
| name      | String | Unique name of the GUIElement within the parent GUI. Used to identify it for later use. Similar to an id attribute on a HTML tag |
| x      | Number | The x position of the element relative to the GUI background box. |
| y      | Number | The y position of the element relative to the GUI background box. |
| w      | Number | The width of the GUI background when displayed. |
| h      | Number | The height of the GUI background when displayed. |


## Instance Methods

`returnType` `methodName(...params)`  
Method description...

`void` `setGUI(GUI gui)`  
Sets this element's parent GUI. This is called internally so there should be no need to call it manually.
