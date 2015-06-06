# circlr

  > Animation rotation via scroll, mouse and touch events

  * Horizontal or vertical orientation
  * Touch events support
  * Scroll support
  * Reverse and cyclic rotation

## Install

```sh
npm install --save circlr
```

```sh
component install andrepolischuk/circlr
```

## Usage

```js
var circlr = require('circlr');
var el = document.querySelector('.container');

circlr(el)
  .scroll()
  .play()
  .on('show', function(n) {

  });
```

## API

### circlr(el)

  Create circular rotation for `el` childrens

```js
circlr('.container');
circlr(document.querySelector('.container'));
```

### .scroll()

  Set rotation via scroll, default `false`

### .vertical()

  Set vertical orientation, default `false`

### .reverse()

  Set reverse rotation, default `false`

### .cycle()

  Set cyclic rotation, default `true`

### .start(n)

  Set start frame, default `0`

### .interval(ms)

  Set playback interval, default `75` ms

### .play([n])

  Start sequence playback to `n` frame or start infinity playback if `n` in not defined

### .stop()

  Stop playback

### .show(n)

  Show `n` frame

### .prev()

  Show previous frame

### .next()

  Show next frame

## Events

  * `show`, when frame is showed

## Support

  * Internet Explorer 7+
  * Chrome
  * Safari
  * Firefox
  * Opera

## License

  MIT
