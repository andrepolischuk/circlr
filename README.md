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
var crl = circular(element, options);
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

  Ciclic rotation (default `true`)

#### options.start

  Start frame (default `0`)

#### options.speed

  Frames change speed via `circular.turn(i)` (default `50` ms)

#### options.autoplay

  Auto playback of sequence initialization (default `false`)

#### options.playSpeed

  Sequence playback speed (default `100` ms)

#### options.loader

  DOM preloader id

#### options.ready

  Images loading callback

#### options.change

  Frames change callback (send current frame and frames length in arguments)

## API

### crl.el

  Return object DOM node

### crl.length

  Return object frames length

### crl.turn(i)

  Animated turn to defined frame `i`

### crl.go(i)

  Go to defined frame `i`

### crl.play()

  Start sequence playback

### crl.stop()

  Stop playback

### crl.hide()

  Hide object DOM node

### crl.show()

  Show object DOM node

### crl.set(options)

  Change object parameters after initialization:

* `vertical`
* `reverse`
* `cycle`
* `speed`
* `playSpeed`

## Support

* Internet Explorer 7+
* Chrome
* Safari
* Firefox
* Opera
