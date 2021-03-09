/* global window */
/* eslint-disable func-names, func-name-matching */

var eventTargetExports = require('@ungap/event-target');
var StorageEvent = typeof window === 'object' && window.StorageEvent ? window.StorageEvent : require('./event').StorageEvent;

var EventTarget = eventTargetExports.default || eventTargetExports;

var target = new EventTarget();

/**
 * Mocked storage (initially borrowed from https://github.com/azu/mock-localstorage)
 * @constructor
 */
function MockedStorage() {
	var storage = {};

	var defaultProps = {
		writable: false,
		configurable: false,
		enumerable: false
	};

	function dispatchEvent(key, value) {
		var storageEvent = new StorageEvent('storage', {
			key: key,
			oldValue: storage[key] || null,
			newValue: value,
			url: ''
		});

		setTimeout(function dispatchAsync() {
			target.dispatchEvent(storageEvent);
		}, 0);
	}

	Object.defineProperty(storage, 'getItem', Object.assign({
		value: function getItem(key) {
			if (arguments.length === 0) {
				throw new TypeError('Failed to execute \'getItem\' on \'Storage\': 1 argument required, but only 0 present.');
			}
			return storage[key.toString()] || null;
		}
	}, defaultProps));

	Object.defineProperty(storage, 'key', Object.assign({
		value: function (keyId) {
			if (arguments.length === 0) {
				throw new TypeError('Failed to execute \'getItem\' on \'Storage\': 1 argument required, but only 0 present.');
			}

			return Object.keys(storage)[keyId];
		}
	}, defaultProps));

	Object.defineProperty(storage, 'setItem', Object.assign({
		value: function setItem(key, value) {
			var stringKey = String(key);
			var stringValue = String(value);

			if (arguments.length <= 1) {
				throw new TypeError('Failed to execute \'setItem\' on \'Storage\': 2 arguments required, but only ' + arguments.length + ' present.');
			}

			dispatchEvent(stringKey, stringValue);
			storage[stringKey] = stringValue;
		}
	}, defaultProps));

	Object.defineProperty(storage, 'removeItem', Object.assign({
		value: function removeItem(key) {
			var stringKey = String(key);

			if (arguments.length === 0) {
				throw new TypeError('Failed to execute \'removeItem\' on \'Storage\': 1 argument required, but only 0 present.');
			}

			dispatchEvent(stringKey, null);
			delete storage[stringKey];
		}
	}, defaultProps));

	Object.defineProperty(storage, 'length', {
		get: function length() {
			return Object.keys(storage).length;
		},
		configurable: false,
		enumerable: false
	});

	Object.defineProperty(storage, 'clear', Object.assign({
		value: function clear() {
			Object.keys(storage).forEach(function (key) {
				storage.removeItem(key);
			});
		}
	}, defaultProps));

	return storage;
}

target.localStorage = new MockedStorage();
target.sessionStorage = new MockedStorage();

module.exports = target;
