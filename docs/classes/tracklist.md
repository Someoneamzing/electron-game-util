# Class: TrackList
> Track lists of NetworkWrapped object instances.

```
class TrackList(Class type, int side)
```
TrackList provides a collection method for NetworkWrapped class instances. It provides methods to apply an operation to the entire collection as well as packet collection methods.

## Parameters
| Parameter | Type  | Description            |
|-----------|-------|------------------------|
| type      | Class | A reference to the Class of the to-be inserted objects. Must be 'NetworkWrapped'. _See the_ [NetworkWrapper](./networkwrapper.md) _class for more info._|
| side      | int   | An integer representing the 'side' the list is working from, either server or client. These sides are represented with the ConnectionManager class under the 'CLIENT' and 'SERVER' properties. |

## Instance Methods

`void` `add(NetworkWrapped obj)`  
Registers an object to be tracked by the list. The object is then affected by the group methods on this instance.

`Array` `getAllInitPack()`  
Retrieves the initPkt for all of the objects regitered in its list and returns them in an array.

`Array` `getInitPack()`  
Retrieves the initPkt for all the objects added since the last call to this method and returns them in an array.

`Array` `getRemovePack()`  
Retrieves the ids for all of the objects removed from the list using the `remove(obj)` method since the last call to this method.

`void` `parseInitPack(Array pack)`  
Calls the constructor of the list's type property using the elements from the provided array as the first parameter.

`void` `parseRemovePack(Array pack)`  
Calls the remove method on the objects in its list identified by the elements in the provided array.

`void` `parseUpdatePack(Array pack)`  
Calls the update method on the objects registered in its list identified by the `netID` property on each element of the provided array, using the element as the first parameter to the method.

`void` `remove(Object obj)`  
Removes the provided object from its list, and if its `side` property is equal to `ConnectionManager.SERVER` then it adds the provided object's `netID` to the removePack.

`void` `update()`  
Calls the same method on all of the objects registered in its list.

`NetworkWrapped` `get(String netID)`  
Retrives the NetworkWrapped object from its list with the given network ID.

## Examples
***A bare-bones TrackList use case***
```

```
