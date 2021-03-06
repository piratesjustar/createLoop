# createLoop

createLoop provides a simple and structured library for creating animation loops in the browser.

**Ye be warned** This is a baby library and has a lot of growing up to do. Bugs and breaking changes ahoy. Contributions very welcome.

For p5 implementation see [p5.createLoop](https://www.npmjs.com/package/p5.createloop)

Features include:
- noise loops
- GIF image rendering

Loop animations can easily be created and rendered as a GIF:

```js
    const loop = createLoop({ 
        duration:5, 
        framesPerSecond:30,
        gif:true,
        canvas })
```

## Example

![vanilla simple example](examples/images/simple.gif)

html:
```html
    <script src="https://unpkg.com/createloop@latest/build/createloop.js"></script>
```

javascript:
```js
window.addEventListener('load', _ => {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    const loop = createLoop({
        duration: 5,
        framesPerSecond: 30,
        gif: true,
        canvas
    })

    loop.start(render)

    function render() {
        const hw = canvas.width / 2
        const hh = canvas.height / 2
        const grd = ctx.createRadialGradient(hw, hh, 0, hw, hh, hh)
        grd.addColorStop(0, `hsl(${loop.progress * 360},100%,50%)`)
        grd.addColorStop(1, `white`)
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
})

```

## Documentation

Animations can be synced to the loop using the provided `progress` and `theta` properties.

The GIF encoder [gif.js](https://github.com/jnordberg/gif.js) uses web workers to render the GIF asynchronously. By default, the GIF will be rendered alongside the sketch and can be downloaded by clicking on it.

### createLoop()

This method in the global namespace will return a loop instance. It can receive servarl arguments:

| Name              | Default   | Description                                                                                                                                |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `duration`        | `3`       | sets the duration in seconds of the loop.                                                                                                  |
| `framesPerSecond` | `30`      | approximate fps of the loop                                                                                                                |
| `noise`           | `options` | See [noise options](README.md#noise-options)                                                                                               |
| `gif`             | `false`   | can accept `true` or `options` to be passed to GIF module. Will not create GIF if left undefined. See [gif options](README.md#gif-options) |

```js
//Options can be passed as an object
createLoop({
    noise:{
        radius:3,
        seed:99
    }
})
//or as camelCase
createLoop({
        noiseRadius:3,
        noiseSeed:99
    })
```

#### noise options

| Name     | Default                  | Description                                                                                                    |
| -------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `radius` | `1`                      | radius of the circle in a noise field to query                                                                 |
| `seed`   | `Math.random() * 999999` | noise field offset                                                                                             |
| `theta`  | `loop.theta`             | By defalt is elapsed loop progress around a circle. This can be set in noise functions but not in `createLoop` |


#### gif options

| Name        | Default     | Description                                                                                                             |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `render`    | `true`      | create an image element and render the GIF to the webpage. Clicking on the image will begin downlaoding the GIF         |
| `open`      | `false`     | open the gif image in a new tab or window                                                                               |
| `download`  | `false`     | download the gif automatically                                                                                          |
| `fileName`  | `image.gif` | name of the downloaded GIF file                                                                                         |
| `startLoop` | `0`         | loop index to begin recording the GIF                                                                                   |
| `endLoop`   | `1`         | loop index to end recording the GIF                                                                                     |
| `canvas`    | `<canvas>`  | the canvas to render. By default this is the first instance of a canvas on the webpage                                  |
| `options`   | `{}`        | options to pass to gif.js encoder. see [gif.js documentation](https://github.com/jnordberg/gif.js#user-content-options) |


### Animation Frame Loops

The simplest way to work with this library is to call `start(callback)` as per the above example. The library then calls `requestAnimationFrame` internally and will render according to the set `framesPerSecond`. This will render the canvas at the same frame rate as the GIF animation, giving an easy sense of what the GIF will look like.

When working with frameworks like `a-frame` where the user has no control over `requestAnimationFrame()`, or if for some other reason the above method is unsuitable, see this [alternative method](./docs/customAnimationLoop.md)

### Loop instance

The loop instance contains several helpful functions and properties for creating awesome animation loops.


#### Celebrity attributes

| Name                    | Description                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start(renderCallback)` | begin rendering the loop, and call `renderCallback` on each loop frame                                                                                |
| `progress`              | stage of completion of the loop. this is `elapsedFrames / framesPerLoop` and has a range of `0 to 1`                                                  |
| `theta`                 | progress around a circle with a a range of `0 to TWO_PI`                                                                                              |
| `noise(options)`        | returns a noise value between -1 and 1 from position `theta` with `radius` on a circle in a noise field. See [noise options](README.md#noise-options) |
| `noise1D(x,options)`    | Same as above also accepting an `x` value, providing a 1D line of noise for each frame                                                                |
| `noise2D(x,y,options)`  | Same as above also accepting a `y` value, providing a 2D plane of noise                                                                               |
| `noiseSeed()`           | set the noise seed                                                                                                                                    |
| `noiseRadius()`         | set the default noise radius                                                                                                                          |

#### Additional attributes

Less common but useful for some.

| Name                 | Description                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `frameDeltaTime`     | miliseconds between frames. This is the delay encoded in each GIF frame.                  |
| `framesPerSecond`    | number of frames in a second                                                              |
| `framesPerLoop`      | number of frames in a loop, this is an integer value of `framesPerSecond * duration`      |
| `elapsedFrames`      | frames elapsed since loop start. This will wrap back to 0 when it reaches `framesPerLoop` |
| `elapsedFramesTotal` | total frames elapsed since loop start                                                     |
| `elapsedLoops`       | loops elapsed                                                                             |
| `lastFrameTime`      | time stamp of last frame                                                                  |

### Contributions

Climb aboard! Make an issue or pull request on the [gitHub page](https://github.com/piratesjustar/createLoop)

### Dependencies / License


    createLoop provides a simple and structured library for creating animation loops in the browser.
    Copyright (C) 2019 Peter Hayman

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

The following libraries are included in `createLoop`.

- GIF Encoder 
  - Creator:    Johan Nordberg
  - Version:    gif.js 0.2.0
  - Link:       https://github.com/jnordberg/gif.js
  - License:    Copyright 2013 Johan Nordberg [MIT License](./docs/MIT-license.md)
- Simplex Noise
  - Creator:    Jonas Wagner 
  - Version:    simplex-noise 2.4.0 
  - Link:       https://github.com/jwagner/simplex-noise.js
  - License:    Copyright 2015 Jonas Wagner [MIT License](./docs/MIT-license.md)

This library was developed using techniques described in The Coding Train Coding challenges:
 - [GIF loops](https://youtu.be/nBKwCCtWlUg)
 - [Polar Noise](https://youtu.be/ZI1dmHv3MeM)
 - [Noise GIF loops](https://youtu.be/c6K-wJQ77yQ)
 - [4D polar noise loops](https://youtu.be/3_0Ax95jIrk)

### Patch Notes

- 0.0.8 - 16/04/2019
  - added gifOptions to camelCase arguments
  - fixed bug where console would log incorrect GIF frame count if rendering more than one loop
- 0.0.7 - 16/04/2019
  - rewrote `start()` function to work with `start dt` rather than `frame dt` to keep in sync with GIF
  - Synchronized GIF image to render on loop
  - added support for module options and `moduleOption` ie `noise.radius` or `noiseRadius`
- 0.0.5 - 15/04/2019
    - added `noiseRadius` and `noiseSeed` to `createLoop` options
    - added option to override `radius` and `theta` in `noise()` functions
- 0.0.3 - 14/04/2019
    - added `fileName` to gif options
- 0.0.1 - 14/04/2019
    - added `start()` method, calling `requestAnimationFrame` internally
- 0.0.0 - 14/04/2019
    - initial release


### TODO
- use gif.js.optimized