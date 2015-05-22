
'use strict';

/**
 * Module dependencies
 */

var bind = require('bind');
var Emitter = require('emitter');
var events = require('event');
var wheel = require('eventwheel');

/**
 * Expose rotation
 */

module.exports = Rotation;

/**
 * Rotation
 *
 * @param {Element} el
 * @api public
 */

function Rotation(el) {
  if (!(this instanceof Rotation)) return new Rotation(el);
  if (typeof el === 'string') el = document.querySelector(el);
  this.el = el;
  this.current = 0;
  this.cycle();
  this.interval(75);
  this.start(0);
  this._ontouchstart = bind(this, 'ontouchstart');
  this._ontouchmove = bind(this, 'ontouchmove');
  this._ontouchend = bind(this, 'ontouchend');
  this._onwheel = bind(this, 'onwheel');
  this.bind();
}

/**
 * Mixin Emitter
 */

Emitter(Rotation.prototype);

/**
 * Set scroll events
 *
 * @param  {Boolean} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.scroll = function(n) {
  this._scroll = n === undefined || n;
  return this;
};

/**
 * Set orientation
 *
 * @param  {Boolean} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.vertical = function(n) {
  this._vertical = n === undefined || n;
  return this;
};

/**
 * Set reverse rotation
 *
 * @param  {Boolean} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.reverse = function(n) {
  this._reverse = n === undefined || n;
  return this;
};

/**
 * Set cyclic rotation
 *
 * @param  {Boolean} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.cycle = function(n) {
  this._cycle = n === undefined || n;
  return this;
};

/**
 * Set interval of sequence rotation
 *
 * @param  {Number} ms
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.interval = function(ms) {
  this._interval = ms;
  return this;
};

/**
 * Start from specified frame
 *
 * @param  {Number} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.start = function(n) {
  var children = this.children();

  this.el.style.position = 'relative';
  this.el.style.width = '100%';

  for (var i = 0; i < children.length; i++) {
    children[i].style.display = 'none';
    children[i].style.width = '100%';
  }

  this.show(n);
  return this;
};

/**
 * Start sequence playback
 *
 * @param  {Number} n
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.play = function(n) {
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

/**
 * Stop sequence playback
 *
 * @return {Rotation}
 * @api public
 */

Rotation.prototype.stop = function() {
  clearInterval(this.timer);
  this.timer = null;
  return this;
};

/**
 * Show previous frame
 *
 * @api public
 */

Rotation.prototype.prev = function() {
  this.show(this.current - 1);
  return this;
};

/**
 * Show next frame
 *
 * @api public
 */

Rotation.prototype.next = function() {
  this.show(this.current + 1);
  return this;
};

/**
 * Show specified frame
 *
 * @param  {Number} n
 * @return {Rotation}
 * @api private
 */

Rotation.prototype.show = function(n) {
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

/**
 * Bind event handlers
 *
 * @api private
 */

Rotation.prototype.bind = function() {
  events.bind(this.el, 'touchstart', this._ontouchstart);
  events.bind(this.el, 'touchmove', this._ontouchmove);
  events.bind(this.el, 'touchend', this._ontouchend);
  events.bind(this.el, 'mousedown', this._ontouchstart);
  events.bind(this.el, 'mousemove', this._ontouchmove);
  events.bind(document, 'mouseup', this._ontouchend);
  wheel.bind(this.el, this._onwheel);
};

/**
 * Handle touchstart
 *
 * @param {Object} e
 * @api private
 */

Rotation.prototype.ontouchstart = function(e) {
  if (this.timer) this.stop();

  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;

  this.touch = this.getTouch(e);
  this.currentTouched = this.current;
};

/**
 * Handle touchmove
 *
 * @param {Object} e
 * @api private
 */

Rotation.prototype.ontouchmove = function(e) {
  if (typeof this.touch !== 'number') return;

  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;

  var touch = this.getTouch(e);
  var len = this.children().length;
  var max = this.el[this._vertical ? 'clientHeight' : 'clientWidth'];
  var offset = touch - this.touch;
  offset = this._reverse ? -offset : offset;
  offset = Math.floor(offset / max * len);

  this.show(this.currentTouched + offset);
};

/**
 * Handle touchend
 *
 * @param {Object} e
 * @api private
 */

Rotation.prototype.ontouchend = function(e) {
  if (typeof this.touch !== 'number') return;

  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;

  this.touch = null;
};

/**
 * Handle wheel
 *
 * @param {Object} e
 * @api private
 */

Rotation.prototype.onwheel = function(e) {
  if (this.timer) this.stop();

  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;

  var delta = e.deltaY || e.detail || (-e.wheelDelta);
  delta = delta / Math.abs(delta);
  delta = this._reverse ? -delta : delta;

  this[delta > 0 ? 'next' : 'prev']();
};

/**
 * Get element childrens
 *
 * @return {Array}
 * @api private
 */

Rotation.prototype.children = function() {
  var nodes = this.el.childNodes;
  var elements = [];

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === 1) elements.push(nodes[i]);
  }

  return elements;
};

/**
 * Get touch position
 *
 * @param  {Object} e
 * @return {Number}
 * @api private
 */

Rotation.prototype.getTouch = function(e) {
  e = e.type === 'touchstart' ? e.changedTouches[0] : e;
  return this._vertical ?
    e.clientY - this.el.offsetTop :
    e.clientX - this.el.offsetLeft;
};
