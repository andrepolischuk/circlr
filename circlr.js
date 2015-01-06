// Circlr © 2014-2015 Andrey Polischuk
// github.com/andrepolischuk/circlr

!function() {

  'use strict';

  /**
   * Mutable parameters
   */

  var mutable = [
    'vertical',
    'reverse',
    'cycle',
    'speed',
    'playSpeed'
  ];

  /**
   * Initialize module
   * @param {Object} el
   * @param {Object} options
   */

  function Circlr(options) {

    /**
     * Mouse events enabled
     */

    options.mouse = options.mouse || true;

    /**
     * Scroll events enabled
     */

    options.scroll = options.scroll || false;

    /**
     * Orientation
     */

    options.vertical = options.vertical || false;

    /**
     * Turning reverse
     */

    options.reverse = options.reverse || false;

    /**
     * Turning cycle
     */

    options.cycle = options.cycle || true;

    /**
     * Start frame
     */

    options.start = options.start || 0;

    /**
     * Turn speed (ms)
     */

    options.speed = options.speed || 50;

    /**
     * Autoplay
     */

    var autoplay = options.autoplay || false;

    /**
     * Play speed (ms)
     */

    options.playSpeed = options.playSpeed || 100;

    /**
     * DOM element
     */

    var el = this.el = options.element;

    /**
     * Exclude duplication
     */

    el.setAttribute('data-circlr', true);

    /**
     * DOM loader
     */

    var loader = options.loader ? document.getElementById(options.loader) : undefined;

    /**
     * Frames length
     */

    var length = this.length = el.getElementsByTagName('img').length;

    /**
     * Frames area height
     */

    var height = options.height || undefined;

    /**
     * Frames area width
     */

    var width = options.width || undefined;

    /**
     * Move enable
     */

    var movable = false;

    /**
     * Loaded images length
     */

    var loaded = [];

    /**
     * Not loaded length
     */

    var errored = [];

    /**
     * Current frame
     */

    var current;

    /**
     * Prevous options
     */

    var pre   = {};

    pre.Y     = null;
    pre.X     = null;
    pre.frame = 0;

    /**
     * Callbacks
     */

    var callbacks = {};

    // all images loaded callback
    callbacks.ready = options.ready || undefined;

    // turn callback
    callbacks.change = options.change || undefined;

    /**
     * Scroll events
     */

    var scrollEvents = [
      'wheel',
      'mousewheel',
      'scroll',
      'DOMMouseScroll'
    ];

    /**
     * Add event listener
     * @param {Object} target
     * @param {String} event
     * @param {Function} fn
     * @api private
     */

    function onEventListener(target, event, fn) {

      if (target.addEventListener) {
        target.addEventListener(event, fn, false);
      } else {
        target.attachEvent('on' + event, function() {
          fn.call(target, window.event);
        });
      }

    }

    /**
     * Prevent default
     * @param {Object} e
     */

    function preventDefault(e) {

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

    }

    /**
     * Pre moving event
     * @param {Object} e
     * @api private
     */

    function preMove(e) {

      autoplay = false;

      preventDefault(e);
      e = e.type === 'touchstart' ? e.changedTouches[0] : e;

      movable = true;

      if (options.vertical) {
        pre.Y = e.clientY - el.offsetTop;
      } else {
        pre.X = e.clientX - el.offsetLeft;
      }

    }

    /**
     * Normalize current frame
     * @param  {Number} cur
     * @return {Number}
     * @api private
     */

    function normalize(cur) {

      if (cur < 0) {
        cur = options.cycle ? cur + length : 0;
      } else if (cur > length - 1) {
        cur = options.cycle ? cur - length : length - 1;
      }

      return cur;

    }

    /**
     * Moving event
     * @param {Object} e
     * @api private
     */

    function isMove(e) {

      if (movable) {

        preventDefault(e);
        e = e.type === 'touchmove' ? e.changedTouches[0] : e;

        // current offset (px)
        var offset = (options.vertical) ? ((e.clientY - el.offsetTop) - pre.Y) : ((e.clientX - el.offsetLeft) - pre.X);
        offset = options.reverse ? -offset : offset;

        // frame step (px)
        var step = width / length;

        // prevous frame
        var previous = current;

        // current offset (frame)
        offset = Math.floor(offset / step);

        if (offset !== current) {

          current = normalize(pre.frame + offset);

          if (previous !== current) {

            // show current frame
            el.getElementsByTagName('img')[previous].style.display = 'none';
            el.getElementsByTagName('img')[current].style.display = 'block';

            if (typeof callbacks.change === 'function') {
              callbacks.change(current, length);
            }

          }

        }

      }

    }

    /**
     * Post moving event
     * @param {Object} e
     * @api private
     */

    function stopMove(e) {

      preventDefault(e);

      movable   = false;
      pre.frame = current;

    }

    /**
     * Moving via scroll
     * @param {Object} e
     * @api private
     */

    function scrollMove(e) {

      autoplay = false;

      preventDefault(e);

      // scroll delta
      var delta = e.deltaY || e.detail || (-e.wheelDelta);
      delta = delta / Math.abs(delta);
      delta = options.reverse ? -delta : delta;

      current = normalize(current + delta);

      // show current frame
      el.getElementsByTagName('img')[pre.frame].style.display = 'none';
      el.getElementsByTagName('img')[current].style.display = 'block';

      pre.frame = current;

      if (typeof callbacks.change === 'function') {
        callbacks.change(current, length);
      }

    }

    /**
     * Initialize events after success images loading
     * @api private
     */

    function initEvents() {

      // loader hide
      if (loader) {
        loader.style.display = 'none';
      }

      if (errored.length === 0) {

        var start = normalize(options.start);

        // all images loaded
        el.getElementsByTagName('img')[start].style.display = 'block';
        current = start;

        el.style.position   = 'relative';
        el.style.width      = '100%';

        if ('ontouchstart' in window || 'onmsgesturechange' in window) {

            if (options.mouse || options.scroll) {
              onEventListener(el, 'touchstart', preMove);
              onEventListener(el, 'touchmove', isMove);
              onEventListener(el, 'touchend', stopMove);
            }

        } else {

          if (options.mouse) {
            onEventListener(el, 'mousedown', preMove);
            onEventListener(el, 'mousemove', isMove);
            onEventListener(document, 'mouseup', stopMove);
          }

          if (options.scroll) {
            for (var e = 0; e < scrollEvents.length; e++) {
              if ('on' + scrollEvents[e] in window) {
                onEventListener(el, scrollEvents[e], scrollMove);
                break;
              }
            }
          }

        }

        if (autoplay) {
          play();
        }

      }

      if (typeof callbacks.ready === 'function') {
        callbacks.ready(errored);
      }

    }

    /**
     * Initialize images events
     * @param {Object} img
     */

    function loadImagesEvents(img) {

      img.onload = function() {

        loaded.push(this.src);

        // show first frame when all images loaded
        if (loaded.length + errored.length === length) {
          initEvents();
        }

      };

      img.onerror = function() {

        errored.push(this.src);

        // show first frame when images loaded
        if (loaded.length + errored.length === length) {
          initEvents();
        }

      };

      img.onreadystatechange = function() {
        this.onload();
      };

    }

    /**
     * Load Object images
     * @api private
     */

    function loadImages() {

      // adding elements
      var img;

      // show loader
      if (loader) {
        loader.style.display = 'block';
      }

      for (var i = 0; i < length; i++) {

        // get object
        img = el.getElementsByTagName('img')[i];

        // set object style
        img.style.display      = 'none';
        img.style.width        = '100%';

        // set object options
        img.setAttribute('src', img.getAttribute('data-src'));
        img.setAttribute('data-index', i);
        img.removeAttribute('data-src');

        loadImagesEvents(img);

      }

      // check elements sizes
      height = height || el.clientHeight;
      width  = width || el.clientWidth;

    }

    /**
     * Initialize loading
     */

    loadImages();

    /**
     * Change current frame
     * @param  {Number} i
     * @api private
     */

    function setFrame(i) {

      el.getElementsByTagName('img')[current].style.display = 'none';
      el.getElementsByTagName('img')[i].style.display = 'block';

      pre.frame = current = i;

    }

    /**
     * Turn to specific frame
     * @param  {Number} i
     * @api public
     */

    var turn = this.turn = function(i) {

      i = normalize(i);
      autoplay = true;

      (function turnInterval() {

        if (i !== current && autoplay) {

          setFrame(normalize(i < current ? current - 1 : current + 1));
          setTimeout(turnInterval, typeof i === 'undefined' ? options.playSpeed : options.speed);

        } else if (i === current) {

          pre.frame = current = i;
          autoplay = false;

          if (typeof callbacks.change === 'function') {
            callbacks.change(current, length);
          }

        }

      })();

    };

    /**
     * Go to specific frame
     * @param  {Number} i
     * @api public
     */

    this.go = function(i) {

      if (i !== current) {

        setFrame(i);

        if (typeof callbacks.change === 'function') {
          callbacks.change(current, length);
        }

      }

    };

    /**
     * Play sequence
     * @api public
     */

    var play = this.play = function() {
      autoplay = true;
      turn();
    };

    /**
     * Stop sequence playng
     * @api public
     */

    this.stop = function() {
      autoplay = false;
    };

    /**
     * Show object
     * @api public
     */

    this.show = function() {
      el.style.display = 'block';
    };

    /**
     * Hide object
     * @api public
     */

    this.hide = function() {
      el.style.display = 'none';
    };

    /**
     * Change Object options
     * @param {Object} options
     * @api public
     */

    this.set = function(set) {
      for (var i = 0, key; i < mutable.length; i++) {
        key = mutable[i];
        options[key] = typeof set[key] !== 'undefined' ? set[key] : options[key];
      }
    };

  }

  /**
   * Example creator
   */

  function Creator(element, options) {

    element = document.getElementById(element);

    if (element.getAttribute('data-circlr')) {
      return;
    }

    options = options || {};
    options.element = element;

    return new Circlr(options);

  }

  /**
   * Module exports
   */

  if (typeof define === 'function' && define.amd) {

    define([], function() {
      return Creator;
    });

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = Creator;

  } else {

    this.circlr = Creator;

  }

}.call(this);
