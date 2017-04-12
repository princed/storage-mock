import test from 'ava';
import sinon from 'sinon';

import window from '.';

const {localStorage, sessionStorage} = window;

/**
 * Adopted from https://github.com/ArtskydJ/mock-dom-storage
 */
test.beforeEach(() => {
	localStorage.clear();
});

test('basic api', t => {
	t.is(typeof localStorage.key, 'function', 'key is a function');
	t.is(typeof localStorage.getItem, 'function', 'getItem is a function');
	t.is(typeof localStorage.setItem, 'function', 'setItem is a function');
	t.is(typeof localStorage.removeItem, 'function', 'removeItem is a function');
	t.is(typeof localStorage.length, 'number', 'length is a number');
	t.is(typeof localStorage.clear, 'function', 'getItem is a function');

	t.is(typeof sessionStorage.key, 'function', 'sessionStorage: key is a function');
	t.is(typeof sessionStorage.getItem, 'function', 'sessionStorage: getItem is a function');
	t.is(typeof sessionStorage.setItem, 'function', 'sessionStorage: setItem is a function');
	t.is(typeof sessionStorage.removeItem, 'function', 'sessionStorage: removeItem is a function');
	t.is(typeof sessionStorage.length, 'number', 'sessionStorage: length is a number');
	t.is(typeof sessionStorage.clear, 'function', 'sessionStorage: getItem is a function');

	t.not(localStorage, sessionStorage, 'storages should be different');
});

test('setItem, getItem, removeItem, length', t => {
	function assertStorage(testKey, testVal, len, msg) {
		t.is(localStorage.getItem(testKey), testVal, msg);
		t.is(localStorage.length, len, 'length is ' + len);
	}

	assertStorage('non-key', null, 0, 'getting non-key returns null');

	localStorage.setItem('item-key', 'value');
	assertStorage('item-key', 'value', 1, 'keys can be added');

	localStorage.removeItem('item-key');
	assertStorage('item-key', null, 0, 'getting non-key returns null');

	localStorage.setItem('', 'value');
	assertStorage('', 'value', 1, 'empty string allowed as key');

	localStorage.setItem('second-item-value', 'second-value');
	assertStorage('second-item-value', 'second-value', 2, 'has expected second value');

	localStorage.clear();
	assertStorage('second-item-value', null, 0, 'clearing removes items');

	localStorage.setItem('second-item-value', 'second-value');
	assertStorage('second-item-value', 'second-value', 1, 'has expected second value');
});

test('should stringify keys', function (t) {
	const keyObject = {
		toString() {
			return 'to-string-result';
		}
	};
	localStorage.setItem(keyObject, 'value');

	t.is(localStorage.key(0), 'to-string-result');
	t.is(localStorage.getItem(keyObject), 'value');
});

test('should trigger events', t => {
	const clock = sinon.useFakeTimers();
	const listener = sinon.spy();

	window.addEventListener('storage', listener);
	localStorage.setItem('item-key', 'value');
	clock.tick(100);
	t.true(listener.calledOnce, 'called on set');

	localStorage.removeItem('item-key');
	clock.tick(100);
	t.true(listener.calledTwice, 'called on remove');

	window.removeEventListener('storage', listener);
	localStorage.setItem('item-key', 'value');
	clock.tick(100);
	t.true(listener.calledTwice, 'not called after removing listener');
});

test('should trigger events with proper data', t => {
	const clock = sinon.useFakeTimers();
	const listener = sinon.spy();

	window.addEventListener('storage', listener);
	localStorage.setItem('item-key', 'old-value');
	clock.tick(100);

	t.true(listener.calledWithMatch({
		key: 'item-key',
		oldValue: null,
		newValue: 'old-value'
	}), 'proper data on setItem');

	listener.reset();
	localStorage.setItem('item-key', 'new-value');
	clock.tick(100);

	t.true(listener.calledWithMatch({
		key: 'item-key',
		oldValue: 'old-value',
		newValue: 'new-value'
	}), 'proper data on second setItem');

	listener.reset();
	localStorage.removeItem('item-key');
	clock.tick(100);

	t.true(listener.calledWithMatch({
		key: 'item-key',
		oldValue: 'new-value',
		newValue: null
	}), 'proper data on removeItem');

	window.removeEventListener('storage', listener);
});

test('keys order', t => {
	const range = [0, 1, 2, 3, 4];

	localStorage.setItem('a', 0);
	localStorage.setItem('b', 1);
	localStorage.setItem('c', 2);
	const keymap1 = range.map(localStorage.key);

	localStorage.setItem('b', 6);
	localStorage.setItem('a', 7);
	const keymap2 = range.map(localStorage.key);

	t.deepEqual(keymap1, keymap2);
});

