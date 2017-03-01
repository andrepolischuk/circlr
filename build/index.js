(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _circlr = require('circlr');

var _circlr2 = _interopRequireDefault(_circlr);

var el = document.querySelector('.rotation');
var btnScroll = document.querySelector('.btn-scroll');
var btnCycle = document.querySelector('.btn-cycle');
var btnReverse = document.querySelector('.btn-reverse');
var btnPrev = document.querySelector('.btn-prev');
var btnNext = document.querySelector('.btn-next');
var btnPlay = document.querySelector('.btn-play');
var btnPlayTo = document.querySelector('.btn-play-to');
var camera = (0, _circlr2['default'])(el).scroll(true);

btnScroll.addEventListener('click', function (e) {
  toggleActive(e.target);
  camera.scroll(isActive(e.target));
}, false);

btnCycle.addEventListener('click', function (e) {
  toggleActive(e.target);
  camera.cycle(isActive(e.target));
}, false);

btnReverse.addEventListener('click', function (e) {
  toggleActive(e.target);
  camera.reverse(isActive(e.target));
}, false);

btnPrev.addEventListener('click', function () {
  camera.prev();
}, false);

btnNext.addEventListener('click', function () {
  camera.next();
}, false);

btnPlay.addEventListener('click', function (e) {
  if (e.target.innerHTML === 'Play') {
    camera.play();
    e.target.innerHTML = 'Stop';
  } else {
    camera.stop();
    e.target.innerHTML = 'Play';
  }
}, false);

btnPlayTo.addEventListener('click', function () {
  camera.play(0);
}, false);

function toggleActive(el) {
  if (isActive(el)) {
    el.className = el.className.replace(/(active)/, '');
  } else {
    el.className += ' active';
  }
}

function isActive(el) {
  return el.className.includes('active');
}

},{"circlr":2}],2:[function(require,module,exports){
'use strict';
var Emitter = require('component-emitter');
var wheel = require('eventwheel');

module.exports = Rotation;

function Rotation(el) {
  if (!(this instanceof Rotation)) return new Rotation(el);
  if (typeof el === 'string') el = document.querySelector(el);
  this.el = el;
  this.current = 0;
  this.cycle(true);
  this.interval(75);
  this.start(0);
  this.onTouchStart = this.onTouchStart.bind(this);
  this.onTouchMove = this.onTouchMove.bind(this);
  this.onTouchEnd = this.onTouchEnd.bind(this);
  this.onWheel = this.onWheel.bind(this);
  this.bind();
}

Emitter(Rotation.prototype);

Rotation.prototype.scroll = function (n) {
  if (this._scroll === n) return this;
  this._scroll = n;

  if (this._scroll) {
    wheel.bind(this.el, this.onWheel);
  } else {
    wheel.unbind(this.el, this.onWheel);
  }

  return this;
};

Rotation.prototype.vertical = function (n) {
  this._vertical = n;
  return this;
};

Rotation.prototype.reverse = function (n) {
  this._reverse = n;
  return this;
};

Rotation.prototype.cycle = function (n) {
  this._cycle = n;
  return this;
};

Rotation.prototype.interval = function (ms) {
  this._interval = ms;
  return this;
};

Rotation.prototype.start = function (n) {
  var children = this.children();
  this.el.style.position = 'relative';
  this.el.style.width = '100%';

  for (var i = 0, len = children.length; i < len; i++) {
    children[i].style.display = 'none';
    children[i].style.width = '100%';
  }

  this.show(n);
  return this;
};

Rotation.prototype.play = function (n) {
  if (this.timer) return;
  var self = this;

  function timer() {
    if (n === undefined || n > self.current) self.next();
    if (n < self.current) self.prev();
    if (n === self.current) self.stop();
  }

  this.timer = setInterval(timer, this._interval);
  return this;
};

Rotation.prototype.stop = function () {
  clearInterval(this.timer);
  this.timer = null;
  return this;
};

Rotation.prototype.prev = function () {
  return this.show(this.current - 1);
};

Rotation.prototype.next = function () {
  return this.show(this.current + 1);
};

Rotation.prototype.show = function (n) {
  var children = this.children();
  var len = children.length;
  if (n < 0) n = this._cycle ? n + len : 0;
  if (n > len - 1) n = this._cycle ? n - len : len - 1;
  children[this.current].style.display = 'none';
  children[n].style.display = 'block';
  if (n !== this.current) this.emit('show', n, len);
  this.current = n;
  return this;
};

Rotation.prototype.bind = function () {
  this.el.addEventListener('touchstart', this.onTouchStart, false);
  this.el.addEventListener('touchmove', this.onTouchMove, false);
  this.el.addEventListener('touchend', this.onTouchEnd, false);
  this.el.addEventListener('mousedown', this.onTouchStart, false);
  this.el.addEventListener('mousemove', this.onTouchMove, false);
  document.addEventListener('mouseup', this.onTouchEnd, false);
  if (this._scroll) wheel.bind(this.el, this.onWheel);
};

Rotation.prototype.unbind = function () {
  this.el.removeEventListener('touchstart', this.onTouchStart, false);
  this.el.removeEventListener('touchmove', this.onTouchMove, false);
  this.el.removeEventListener('touchend', this.onTouchEnd, false);
  this.el.removeEventListener('mousedown', this.onTouchStart, false);
  this.el.removeEventListener('mousemove', this.onTouchMove, false);
  document.removeEventListener('mouseup', this.onTouchEnd, false);
  if (this._scroll) wheel.unbind(this.el, this.onWheel);
};

Rotation.prototype.onTouchStart = function (event) {
  if (this.timer) this.stop();
  event.preventDefault();
  this.touch = this.getTouch(event);
  this.currentTouched = this.current;
};

Rotation.prototype.onTouchMove = function (event) {
  if (typeof this.touch !== 'number') return;
  event.preventDefault();
  var touch = this.getTouch(event);
  var len = this.children().length;
  var max = this.el[this._vertical ? 'clientHeight' : 'clientWidth'];
  var offset = touch - this.touch;
  offset = this._reverse ? -offset : offset;
  offset = Math.floor(offset / max * len);
  this.show(this.currentTouched + offset);
};

Rotation.prototype.onTouchEnd = function (event) {
  if (typeof this.touch !== 'number') return;
  event.preventDefault();
  this.touch = null;
};

Rotation.prototype.onWheel = function (event) {
  if (this.timer) this.stop();
  event.preventDefault();
  var delta = event.deltaY || event.detail || (-event.wheelDelta);
  delta = delta !== 0 ? delta / Math.abs(delta) : delta;
  delta = this._reverse ? -delta : delta;
  this[delta > 0 ? 'next' : 'prev']();
};

Rotation.prototype.children = function () {
  var nodes = this.el.childNodes;
  var elements = [];

  for (var i = 0, len = nodes.length; i < len; i++) {
    if (nodes[i].nodeType === 1) elements.push(nodes[i]);
  }

  return elements;
};

Rotation.prototype.getTouch = function (event) {
  event = /^touch/.test(event.type) ? event.changedTouches[0] : event;

  return this._vertical ?
    event.clientY - this.el.offsetTop :
    event.clientX - this.el.offsetLeft;
};

},{"component-emitter":3,"eventwheel":5}],3:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],4:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
},{}],5:[function(require,module,exports){

'use strict';

/**
 * Module dependencies
 */

try {
  var events = require('event');
} catch (err) {
  var events = require('component-event');
}

/**
 * Wheel events
 */

var wheelEventsMap = [
  'wheel',
  'mousewheel',
  'scroll',
  'DOMMouseScroll'
];

/**
 * Wheel event name
 */

var wheelEvent = 'mousewheel';

if (window.addEventListener) {
  for (var e = 0; e < wheelEventsMap.length; e++) {
    if ('on' + wheelEventsMap[e] in window) {
      wheelEvent = wheelEventsMap[e];
      break;
    }
  }
}

/**
 * Expose bind
 */

module.exports = bind.bind = bind;

/**
 * Bind
 *
 * @param  {Element} element
 * @param  {Function} fn
 * @param  {Boolean} capture
 * @return {Function}
 * @api public
 */


function bind(element, fn, capture) {
  return events.bind(element, wheelEvent, fn, capture || false);
}

/**
 * Expose unbind
 *
 * @param  {Element} element
 * @param  {Function} fn
 * @param  {Boolean} capture
 * @return {Function}
 * @api public
 */

module.exports.unbind = function(element, fn, capture) {
  return events.unbind(element, wheelEvent, fn, capture || false);
};

},{"component-event":4,"event":4}]},{},[1]);
