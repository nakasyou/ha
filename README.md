# @ns/ha | Hajs

Ha (波, means wave) is a JavaScript library to make wave.

Demo: https://nakasyou.github.io/ha

## Usage

You can use JSR.

```shell
deno add @ns/ha
bunx jsr add @ns/ha
pnpx jsr add @ns/ha
yarn dlx jsr add @ns/ha
npx jsr add @ns/ha
```

You can do like this:

```ts
const closeWave = ha({}).do({
  target: document.getElementById('button') as HTMLButtonElement,
  waveDuration: 100, // milliseconds, wave speed
  gooutDuration: 100, // milliseconds, speed for going out
  color: '#aaa', // gray
  opacity: 0.5, // Opacity of wave
  pos: {
    clientX: 0
    clientY: 0
  }, // Position
})
setTimeout(() => closeWave(), 100) // You have to close wave manually.
```

Or, you can save settings when wave init:

```ts
const btnWave = wave({
  target: document.getElementById('button') as HTMLButtonElement,
  duration: 100, // milliseconds, speed
  color: '#aaa' // gray
})

btnWave.do({
  pos: ...
})
```

Extend it:

```ts
const redWave = btnWave.extend({
  color: 'red',
})
```

If you want to use it for buttons, you can use `@ns/ha/events`.

```ts
import { waveAsPointerDown } from '@ns/ha/events'

const mywave = ha({...})
document.getElementById('my-button')
  .addEventListener('pointerdown', waveAsPointerDown(mywave))
```
