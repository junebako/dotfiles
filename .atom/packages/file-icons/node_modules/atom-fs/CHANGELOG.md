Change Log
==========

This project adheres to [Semantic Versioning](http://semver.org).

[Staged]: https://github.com/file-icons/Atom-FS/compare/v0.1.6...HEAD


[v0.1.6](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.6)
------------------------------------------------------------------------
**September 14th, 2018**  
* Transferred repository to `file-icons` organisation on GitHub
* Upgraded [`mapped-disposable`][] dependency to [`v1.0.2`][1]

[`mapped-disposable`]: https://github.com/file-icons/MappedDisposable
[1]: https://github.com/file-icons/MappedDisposable/releases/tag/v1.0.2


[v0.1.5](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.5)
------------------------------------------------------------------------
**August 13th, 2018**  
* Inlined helper functions previously imported from [`alhadis.utils`][].
* Removed event logging from system-task queue.
* Added [`normalisePath`][] function to exports list.

[`alhadis.utils`]: https://github.com/Alhadis/Utils
[`normalisePath`]: ../../blob/1b3ba49/lib/utils.js#L43-L61


[v0.1.4](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.4)
------------------------------------------------------------------------
**November 20th, 2017**  
Added the auxiliary [`PathMap`][] class to normalise paths consistently.

[`PathMap`]: ./lib/path-map.js


[v0.1.3](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.3)
------------------------------------------------------------------------
**August 17th, 2017**  
Fixed a regression with reading the contents of opened text-buffers.


[v0.1.2](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.2)
------------------------------------------------------------------------
**August 17th, 2017**  
Fixed an oversight where the wrong object was globalised at entry point.


[v0.1.0](https://github.com/file-icons/Atom-FS/releases/tag/v0.1.0)
------------------------------------------------------------------------
**March 21st, 2017**  
Initial release of filesystem API decoupled from [`file-icons`][].

[`file-icons`]: https://github.com/file-icons/atom
