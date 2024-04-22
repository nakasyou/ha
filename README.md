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
wave({}).do({
  target: document.getElementById('button') as HTMLButtonElement,
  duration: 100, // milliseconds, speed
  color: '#aaa' // gray
  pos: {
    clientX: 0
    clientY: 0
  } // Position
})
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
  color: 'red'
})
```