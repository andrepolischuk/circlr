// Circular © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/circular

!function(undefined) {

  'use strict';

  /**
   * Mutable parameters
   */

  var mutable = [
    'vertical',
    'reverse',
    'cycle',
    'interval'
  ];

  /**
   * Initialize module
   * @param {Object} el
   * @param {Object} options
   */

  function Circular(options) {

    /**
     * Mouse events enabled
     */

    options.mouse    = options.mouse || true;

    /**
     * Scroll events enabled
     */

    options.scroll   = options.scroll || false;

    /**
     * Orientation
     */

    options.vertical = options.vertical || false;

    /**
     * Turning reverse
     */

    options.reverse  = options.reverse || false;

    /**
     * Turning cycle
     */

    options.cycle    = options.cycle || false;

    /**
     * Turn interval (ms)
     */

    options.interval = options.interval || 25;

    /**
     * DOM element
     */

    var el = this.el = options.element;

    /**
     * Exclude duplication
     */

    el.setAttribute('data-circular', true);

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
     * Pre moving event
     * @api private
     */

    var preMove = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      e = e.type === 'touchstart' ? e.changedTouches[0] : e;

      movable = true;

      if (options.vertical) {
        pre.Y = e.clientY - el.offsetTop;
      } else {
        pre.X = e.clientX - el.offsetLeft;
      }

    };

    /**
     * Normalize current frame
     * @param  {Number} cur
     * @return {Number}
     * @api private
     */

    var currentNorm = function(cur) {

      if (cur < 0) {
        cur = options.cycle ? cur + length : 0;
      } else if (cur > length - 1) {
        cur = options.cycle ? cur - length : length - 1;
      }

      return cur;

    };

    /**
     * Moving event
     * @api private
     */

    var isMove = function(e) {

      if (movable) {

        e = e || window.event;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
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

          current = currentNorm(pre.frame + offset);

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

    };

    /**
     * Post moving event
     * @api private
     */

    var stopMove = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      movable   = false;
      pre.frame = current;

    };

    /**
     * Moving via scroll
     * @api private
     */

    var scrollMove = function(e) {

      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      // scroll delta
      var delta = e.deltaY || e.detail || (-e.wheelDelta);
      delta = delta / Math.abs(delta);
      delta = options.reverse ? -delta : delta;

      current = currentNorm(current + delta);

      // show current frame
      el.getElementsByTagName('img')[pre.frame].style.display = 'none';
      el.getElementsByTagName('img')[current].style.display = 'block';

      pre.frame = current;

      if (typeof callbacks.change === 'function') {
        callbacks.change(current, length);
      }

    };

    /**
     * Initialize events after success images loading
     * @api private
     */

    var initEvents = function() {

      // loader hide
      if (loader) {
        loader.style.display = 'none';
      }

      if (errored.length === 0) {

        // all images loaded
        el.getElementsByTagName('img')[0].style.display = 'block';
        current = 0;

        el.style.position   = 'relative';
        el.style.width      = '100%';

        if ('ontouchstart' in window || 'onmsgesturechange' in window) {

            // touch events

            if (options.mouse || options.scroll) {

              // start move
              el.addEventListener('touchstart', preMove, false);

              // move
              el.addEventListener('touchmove', isMove, false);

              // stop move
              el.addEventListener('touchend', stopMove, false);

            }

        } else {

          if (options.mouse) {

            // mouse events

            // start move
            el.onmousedown = preMove;

            // move
            el.onmousemove = isMove;

            // stop move
            document.onmouseup  = stopMove;

          }

          if (options.scroll) {

            // scroll event

            if ('function' === typeof window.addEventListener) {

              if ('onwheel' in window) {
                el.addEventListener('wheel', scrollMove, false);
              } else if ('onmousewheel' in window) {
                el.addEventListener('mousewheel', scrollMove, false);
              } else if ('onscroll' in window) {
                el.addEventListener('scroll', scrollMove, false);
              } else {
                el.addEventListener('DOMMouseScroll', scrollMove, false);
              }

            } else {

              // scroll event
              if (options.scroll) {
                el.attachEvent('onmousewheel', scrollMove);
              }

            }

          }

        }

      }

      if (typeof callbacks.ready === 'function') {
        callbacks.ready(errored);
      }

    };

    /**
     * Initialize images events
     */

    var loadImagesEvents = function(img) {

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

    };

    /**
     * Load Object images
     * @api private
     */

    var loadImages = function() {

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

    };

    /**
     * Initialize loading
     */

    loadImages();

    /**
     * Change current frame
     * @param  {Number} i
     * @api private
     */

    var turn = function(i) {

      el.getElementsByTagName('img')[current].style.display = 'none';
      el.getElementsByTagName('img')[i].style.display = 'block';

      pre.frame = current = i;

    };

    /**
     * Turn to specific frame
     * @param  {Number} i
     * @api public
     */

    this.turn = function(i) {

      i = currentNorm(i);

      (function turnInterval() {

        if (i !== current) {

          turn(currentNorm(current + 1));
          setTimeout(turnInterval, options.interval);

        } else if (i === current) {

          pre.frame = current = i;

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

        turn(i);

        if (typeof callbacks.change === 'function') {
          callbacks.change(current, length);
        }

      }

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

    if (element.getAttribute('data-circular')) {
      return;
    }

    options = options || {};
    options.element = element;

    return new Circular(options);

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

    this.circular = Creator;

  }

}.call(this);
