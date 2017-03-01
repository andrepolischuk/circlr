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

## Usage

```js
import circlr from 'circlr';

const el = document.querySelector('.container');

circlr(el)
  .scroll(true)
  .play()
  .on('show', n => {

  });
```

## API

### circlr(el)

Create rotation instance.

#### el

Type: `string`, `element`

Element.

### .scroll(n)

#### n

Type: `boolean`

Rotation via scroll flag.

### .vertical(n)

#### n

Type: `boolean`

Vertical orientation flag.

### .reverse(n)

#### n

Type: `boolean`

Reverse rotation flag.

### .cycle(n)

#### n

Type: `boolean`

Cyclic rotation flag, default `true`.

### .start(n)

#### n

Type: `number`

Start frame, default `0`.

### .interval(ms)

#### n

Type: `number`

Playback interval, default `75` ms.

### .play([n])

Start sequence playback.

#### n

Type: `number`

Frame number for playback to him or infinity playback if number in not specified.

### .stop()

Stop playback.

### .show(n)

Show specified frame.

#### n

Type: `number`

Frame number.

### .prev()

Show previous frame.

### .next()

Show next frame.

### .unbind()

Unbind rotation events.

## Events

* `show`, when frame is showed

## Support

* Internet Explorer 9+
* Chrome
* Safari
* Firefox
* Opera

## Related

* [react-rotation][react-rotation] - react rotation component

## License

MIT

[react-rotation]: https://github.com/andrepolischuk/react-rotation
