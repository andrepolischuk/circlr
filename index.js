'use strict';
var bind = require('component-bind');
var Emitter = require('component-emitter');
var events = require('component-event');
var wheel = require('eventwheel');

module.exports = Rotation;

function Rotation(el) {
  if (!(this instanceof Rotation)) return new Rotation(el);
  if (typeof el === 'string') el = document.querySelector(el);
  this.el = el;
  this.current = 0;
  this.cycle();
  this.interval(75);
  this.start(0);
  this.onTouchStart = bind(this, 'onTouchStart');
  this.onTouchMove = bind(this, 'onTouchMove');
  this.onTouchEnd = bind(this, 'onTouchEnd');
  this.onWheel = bind(this, 'onWheel');
  this.bind();
}

Emitter(Rotation.prototype);

Rotation.prototype.scroll = function (n) {
  this._scroll = n === undefined || n;
  return this;
};

Rotation.prototype.vertical = function (n) {
  this._vertical = n === undefined || n;
  return this;
};

Rotation.prototype.reverse = function (n) {
  this._reverse = n === undefined || n;
  return this;
};

Rotation.prototype.cycle = function (n) {
  this._cycle = n === undefined || n;
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
  this.show(this.current - 1);
  return this;
};

Rotation.prototype.next = function () {
  this.show(this.current + 1);
  return this;
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
  events.bind(this.el, 'touchstart', this.onTouchStart);
  events.bind(this.el, 'touchmove', this.onTouchMove);
  events.bind(this.el, 'touchend', this.onTouchEnd);
  events.bind(this.el, 'mousedown', this.onTouchStart);
  events.bind(this.el, 'mousemove', this.onTouchMove);
  events.bind(document, 'mouseup', this.onTouchEnd);
  wheel.bind(this.el, this.onWheel);
};

Rotation.prototype.onTouchStart = function (event) {
  if (this.timer) this.stop();
  event = event || window.event;
  if (event.preventDefault) event.preventDefault();
  event.returnValue = false;
  this.touch = this.getTouch(event);
  this.currentTouched = this.current;
};

Rotation.prototype.onTouchMove = function (event) {
  if (typeof this.touch !== 'number') return;
  event = event || window.event;
  if (event.preventDefault) event.preventDefault();
  event.returnValue = false;
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
  event = event || window.event;
  if (event.preventDefault) event.preventDefault();
  event.returnValue = false;
  this.touch = null;
};

Rotation.prototype.onWheel = function (event) {
  if (this.timer) this.stop();
  event = event || window.event;
  if (event.preventDefault) event.preventDefault();
  event.returnValue = false;
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
