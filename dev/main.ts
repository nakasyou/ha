import { wave } from '../mod.ts'
import './style.css'

const waves = document.getElementById('waves')

if (!(waves instanceof HTMLDivElement)) {
  throw new Error('container is not HTMLDivElement')
}

const buttons = Array.from(waves.children)

for (const btn of buttons) {
  if (!(btn instanceof HTMLButtonElement)) {
    throw new Error('button is not HTMLButtonElement')
  }

  const btnWave = wave({
    target: btn,
    duration: parseInt(btn.dataset.duration ?? '500'),
    color: btn.dataset.color ?? '#aaa'
  })
  btn.onclick = (evt) => {
    btnWave.do({
      pos: evt
    })
  }
}
