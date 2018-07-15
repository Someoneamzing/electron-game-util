# Class: ConnectionManager
> Maintains the client-server shared states using TrackLists

```
class ConnectionManager(int side, [Client, Server] server)
```
The ConnectionManager manages the connection between Server and Client, maintaining representations of the server-side TrackLists on the client. Additionally it manages information about the connected clients and the state of their ControlInterfaces if provided.

## Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| side      | int  | An integer representing the 'side' the list is working from, either server or client. These sides are represented with the ConnectionManager class under the 'CLIENT' and 'SERVER' properties. |
| server    | [Client, Server] | Either a Server or Client instance, matching the side parameter passed, used to send and receive information from the other side to communicate the state of the current side. |

## Instance Methods
`void` `addTrackList(TrackList list)`  
Registers a TrackList to be shared across the client-server connection.

`void` `firstInit(Socket socket)`  
Used internally to send a representation of all objects tracked by the registered lists to a new connecting client. `socket` is an instance of a socket.io Socket from the connecting client.

`void` `init(Object pack)`  
Does one of two things, depending on its `side` property. If its `side` is equal to `ConnectionManager.SERVER` it will call `getInitPack()` on all of its registered lists adding the returned arrays to an object under the property name of the lists type name. It will then send that object to the client to be processed. Otherwise if its `side` is equal to `ConnectionManager.CLIENT` it will go through each property on the `pack` argument and pass it to the list identified by that type to the list's `parseInitPack()` method.

`void` `update(Object pack)`  
Behaves similarly to `init()`, however it uses `getUpdatePack()` instead of `getInitPack()`, and `parseUpdatePack()` instead of `parseInitPack()`.

`void` `remove(Object pack)`  
Behaves similarly to `init()`, however it uses `getRemovePack()` instead of `getInitPack()`, and `parseRemovePack()` instead of `parseInitPack()`.
