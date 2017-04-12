var assign = Object.assign || require('object.assign');

/**
 * Basic Event
 * @param type
 * @param bubbles
 * @param cancelable
 * @param target
 * @constructor
 */
function Event(type, bubbles, cancelable, target) {
	this.initEvent(type, bubbles, cancelable, target);
}

Event.prototype = {
	initEvent: function (type, bubbles, cancelable, target) {
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
		this.target = target;
	},

	stopPropagation: function () {},

	preventDefault: function () {
		this.defaultPrevented = true;
	}
};

/**
 * Storage event
 * @param {string} type Event type
 * @param {Object} customData Custom data
 * @param {string} target Event target
 * @constructor
 */
function StorageEvent(type, customData, target) {
	this.initEvent(type, false, false, target);
	assign(this, customData);
}

StorageEvent.prototype = new Event();

StorageEvent.prototype.constructor = StorageEvent;

exports.Event = Event;
exports.StorageEvent = StorageEvent;
