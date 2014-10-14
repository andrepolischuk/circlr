# Circular

  Animation rotation via scroll, mouse and touch events

* Horizontal or vertical orientation
* Touch events support
* Scroll support
* Images loading progress
* Reverse and cyclic rotation

## Instalation

  Via some tags in page sources:

```html
<div id="circular">
  <img data-src="/static/images/frame0.jpg" alt="">
  <img data-src="/static/images/frame1.jpg" alt="">
  <img data-src="/static/images/frame2.jpg" alt="">
  <img data-src="/static/images/frame3.jpg" alt="">
  <img data-src="/static/images/frame4.jpg" alt="">
  <img data-src="/static/images/frame5.jpg" alt="">
  ...
  <div id="loader"></div>
</div>
...
<script src="/static/js/circular.min.js"></script>
```

## Initialization

  Create object with parameters:

```js
var circular = new Circular(element, options);
```

### element

  DOM element id

### options

  Parameters object

#### options.mouse
  
  Rotation via mouse moves (default `true`)

#### options.scroll

  Rotation via scroll (default `false`)

#### options.vertical

  Moves vertical orientation (default `false`)

#### options.reverse

  Reverse rotation (default `false`)

#### options.cycle

  Ciclic rotation (default `false`)

#### options.interval

  Frames change interval via `circular.turn(i)` (default `25ms`)

#### options.loader

  DOM preloader id

#### options.success

  Images success loading callback

#### options.error

  Images error loading callback (send errored images array in arguments)

#### options.change

  Frames change callback (send current frame and frames length in arguments)

## API

### circular.el

  Return object DOM node

### circular.length

  Return object frames length

### circular.turn(i)

  Animated turn to defined frame `i`

### circular.go(i)

  Go to defined frame `i`

### circular.hide()

  Hide object DOM node

### circular.show()

  Show object DOM node

### circular.set(options)

  Change object parameters and callbacks after initialize:

* `vertical`
* `reverse`
* `cycle`
* `interval`
* `success`
* `error`
* `change`

## Support

* Internet Explorer 7+
* Chrome
* Safari
* Firefox
* Opera