# Mixin: NetworkWrapper
> Defines properties and methods used in network transmission.

```
function NetworkWrapper(Class base, TrackList list)
```
The NetworkWrapper mixin adds properties and methods to a class prototype to enable it to be transferred over the network.

## Parameters
| Parameter | Type      | Description |
|-----------|-----------|-------------|
| base      | Class | The class to extend and define the properties on. |
| list      | TrackList | The list to which new instances are registered and updates are received from. |

## Instance Methods

`Object` `getInitPkt()`  
Returns a serialised version of the class passed to the constructor of the object on the other side to create an identical representation. Should only be used on the server side.

`Object` `getUpdatePkt()`  
Returns an object representing the current state of the object, to recreate that state on the other side's representation. Should only be used on the server side.

`void` `remove()`  
Removes the object from the associated `TrackList` and will, if provided, call the same method on the parent class.

`void` `update(...params)`  
Provides a fallback when calling the method on an instance. If the extended class provides an update method it will be called with the passed arguments. Otherwise the call will simply do nothing, essentially failing silently.
