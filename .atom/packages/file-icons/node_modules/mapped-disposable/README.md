MappedDisposable
================

[![Build status: TravisCI][TravisCI-badge]][TravisCI-link]
[![Build status: AppVeyor][AppVeyor-badge]][AppVeyor-link]


Map-flavoured alternative to Atom's [`CompositeDisposable`][] class. Intended for
use in Atom package development, but compatible with any project that uses [`event-kit`][].


Usage
-----

This class simplifies scenarios when multiple [`Disposable`][] instances are grouped together
and referenced by name. The existing practice was to create multiple `CompositeDisposable` objects,
each bound to a different property or variable name:

~~~js
let editorDisposables = new CompositeDisposable();
let projectDisposables = new CompositeDisposable();
let paneDisposables = new CompositeDisposable();
~~~

With a `MappedDisposable`, disposable groups become easier to manage:

~~~js
let disposables = new MappedDisposable();
disposables.set("editor", new CompositeDisposable());
disposables.set("project", new CompositeDisposable());
disposables.set("pane", new CompositeDisposable());

disposables.add("editor", editor.onDidChange(…));
disposables.add("project", project.onDidChangePaths(…));
~~~

Entries can be disposed of individually or altogether:

~~~js
disposables.dispose("editor"); // Dispose only editor-related disposables
disposables.dispose();         // Dispose of everything
~~~

A `MappedDisposable` operates just like an ordinary [`Map`][]. Anything works as an
entry key (not just strings), and values can be queried using the `has()` and `get()`
methods that you're used to:

~~~js
const packageObject = atom.packages.getActivePackage("file-icons");
disposables.add(packageObject, new Disposable(…));
disposables.get(packageObject); // => CompositeDisposable;
~~~



API
---

### Constructor

#### `new MappedDisposable([iterable])`
Create a new instance, optionally with a list of keys and disposables.

~~~js
new MappedDisposable([ [key1, disp1], [key2, disp2] ]);
~~~

<!--------------------------------------------->
| Parameter  | Type  | Default  | Attributes   |
| ---------- | ----- | -------- | ------------ |
| `iterable` | Any   | `null`   | *Optional*   |
<!--------------------------------------------->


### Instance methods

<a name="dispose"></a>
#### `dispose(...keys)`
Delete keys and dispose of their values.

If passed no arguments, the method disposes of everything, rendering the
`MappedDisposable` instance completely inert. Future method calls do nothing.

<!------------------------------------------------------------->
| Parameter  | Type  | Default  | Attributes                   |
| ---------- | ----- | -------- | ---------------------------- |
| `...keys`  | Any   | `null`   | *Optional, variable-length*  |
<!------------------------------------------------------------->


<a name="add"></a>
#### `add(key, [...disposables])`
Add one or more disposables to a key's disposables list

<!------------------------------------------------------------------->
| Parameter        | Type  | Default  | Attributes                   |
| ---------------- | ----- | -------- | ---------------------------- |
| `key`            | Any   | None     | *Required*                   |
| `...disposables` | Any   | None     | *Optional, variable-length*  |
<!------------------------------------------------------------------->


<a name="remove"></a>
#### `remove(key, [...disposables])`
Remove one or more disposables from a key's disposables list.

If no disposables are passed, the object itself is removed from the
`MappedDisposable`. Any disposables keyed to it are not disposed of.

<!------------------------------------------------------------------->
| Parameter        | Type  | Default  | Attributes                   |
| ---------------- | ----- | -------- | ---------------------------- |
| `key`            | Any   | None     | *Required*                   |
| `...disposables` | Any   | None     | *Optional, variable-length*  |
<!------------------------------------------------------------------->


<a name="delete"></a>
#### `delete(key, [...disposables])`
Alias of [`remove()`][], included for parity with [`Map`][] objects.

<!------------------------------------------------------------------->
| Parameter        | Type  | Default  | Attributes                   |
| ---------------- | ----- | -------- | ---------------------------- |
| `key`            | Any   | None     | *Required*                   |
| `...disposables` | Any   | None     | *Optional, variable-length*  |
<!------------------------------------------------------------------->


<a name="clear"></a>
#### `clear()`
Clear the contents of the `MappedDisposable`.

Individual disposables are not disposed of.


<a name="has"></a>
#### `has(key)`
**Returns:** [`Boolean`][]

Determine if an entry with the given key exists in the `MappedDisposable`.

<!------------------------------------------------------------------->
| Parameter        | Type  | Default  | Attributes                   |
| ---------------- | ----- | -------- | ---------------------------- |
| `key`            | Any   | None     | *Required*                   |
<!------------------------------------------------------------------->


<a name="get"></a>
#### `get(key)`
**Returns:** [`CompositeDisposable`][] | `undefined`  

Retrieve the disposables list keyed to an object.

If the `MappedDisposable` has been disposed, the method returns `undefined`.

<!------------------------------------------------------------------->
| Parameter        | Type  | Default  | Attributes                   |
| ---------------- | ----- | -------- | ---------------------------- |
| `key`            | Any   | None     | *Required*                   |
<!------------------------------------------------------------------->


<a name="set"></a>
#### `set(key, value)`
Replace the disposable that's keyed to an object.

A [`TypeError`][] is thrown if the value argument lacks a `dispose` method.

<!-------------------------------------------------------------------------------->
| Parameter        | Type               | Default  | Attributes                   |
| ---------------- | ------------------ | -------- | ---------------------------- |
| `key`            | Any                | None     | *Required*                   |
| `value`          | [`Disposable`][]   | None     | *Required*                   |
<!-------------------------------------------------------------------------------->



### Instance properties

#### `disposed`
**Default:**   `false`  
**Type:**      [`Boolean`][]

Whether the instance has been irrevocably disposed of.


#### `size`
**Default:**   `0`  
**Type:**      [`Number`][]  
**Read-only**

Number of entries (key/disposable pairs) stored in the instance.



[Referenced links]:_________________________________________________________
[`Boolean`]:             https://mdn.io/Boolean
[`CompositeDisposable`]: https://atom.io/docs/api/latest/CompositeDisposable
[`Disposable`]:          https://atom.io/docs/api/latest/Disposable
[`Map`]:                 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[`Number`]:              https://mdn.io/Number
[`TypeError`]:           https://mdn.io/TypeError
[`event-kit`]:           https://npmjs.com/package/event-kit
[`remove()`]:            #remove
[AppVeyor-badge]:        https://ci.appveyor.com/api/projects/status/o39i233c4u05gcle?svg=true
[AppVeyor-link]:         https://ci.appveyor.com/project/Alhadis/mapped-disposable
[TravisCI-badge]:        https://travis-ci.org/file-icons/mapped-disposable.svg?branch=master
[TravisCI-link]:         https://travis-ci.org/file-icons/mapped-disposable
