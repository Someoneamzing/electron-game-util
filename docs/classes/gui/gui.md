# Class: GUI
> Manages events and transmission of data for user interfaces.

```
class GUI(String name, Number w, Number h, [Client, Server] server) extends EventEmitter
```
The GUI class acts as both a container for [GUIElement](./guielement.md)s and a handler for communication of user interface related data.

## Parameters
| Parameter | Type      | Description |
|-----------|-----------|-------------|
| name      | String | Unique name of the GUI. Used to identify it later on for use. |
| w      | Number | The width of the GUI background when displayed |
| h      | Number | The height of the GUI background when displayed |
| server      | [Client, Server] | The client or server instance for the session. Used for communication with the other party, as well as determination of side |


## Instance Methods

`returnType` `methodName(...params)`  
Method description...

`returnType` `methodName(...params)`  
Method description...
