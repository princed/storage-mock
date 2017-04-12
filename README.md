# storage-mock [![Build Status](https://travis-ci.org/princed/storage-mock.svg?branch=master)](https://travis-ci.org/princed/storage-mock)

> Web Storage API Mock with events support


## Install

```
$ npm install --save storage-mock
```


## Usage

```js
const mockedWindow = require('storage-mock');

mockedWindow.addEventListener('storage', e => {
	e.key // item-key
	e.oldValue // null
	e.newValue // item-value
});

mockedWindow.localStorage.setItem('item-key', 'item-value');
```

## License

MIT © Eugene Datsky
