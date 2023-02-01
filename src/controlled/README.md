# DndTree

The library makes it easier to construct your own tree-view
in which the items can be moved around using the mouse, touch or the
keyboard.

The library is unopionated about the user interface.

The controlle expects you to provide a data item but makes no assumption
about its type or shape. It will simply be provided to the user callbacks that
are used to extract data from it. Similarly, the library makes no assumptions
about what a tree item is. It will pass it to the callbacks when appropriate
and its your job to extract meaningful information.

The controller will (re)create an internal representation for the items
that you provide each time they change (a shallow compare, so make
sure to provide a new object each there's a change in either
the list of items or their properties). Conversely, whenever the user
makes a change the library will forward the request through a
callback.

The expanded/collapsed state of each item can either be controlled
(you supply a callback to be used when the user wants to change the state)
or uncontrolled (the internal item represenatation is used).
