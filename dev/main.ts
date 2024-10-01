import { ha } from '../mod.ts'
import './style.css'
const buttons = document.getElementsByClassName('wave')

const $waveDurationSetting = document.getElementById(
  'setting-waveDuration',
) as HTMLInputElement
const $colorSetting = document.getElementById(
  'setting-color',
) as HTMLInputElement
const $gooutDurationSetting = document.getElementById(
  'setting-gooutDuration',
) as HTMLInputElement
const $opacitySetting = document.getElementById(
  'setting-opacity',
) as HTMLInputElement

for (const btn of Array.from(buttons)) {
  if (!(btn instanceof HTMLButtonElement)) {
    throw new Error('button is not HTMLButtonElement')
  }

  const btnWave = ha({
    target: btn,
    opacity: 0,
  })
  btn.onpointerdown = (evt) => {
    const endWave = btnWave.do({
      pos: evt,
      waveDuration: Number.parseInt($waveDurationSetting.value),
      gooutDuration: Number.parseInt($gooutDurationSetting.value),
      color: btn.dataset.color ?? $colorSetting.value,
      opacity: Number.parseInt($opacitySetting.value) / 100,
    })
    const end = () => {
      endWave()
      btn.removeEventListener('pointerup', end)
      btn.removeEventListener('pointerleave', end)
      btn.removeEventListener('pointercancel', end)
      btn.removeEventListener('pointerout', end)
    }
    btn.addEventListener('pointerup', end)
    btn.addEventListener('pointerleave', end)
    btn.addEventListener('pointercancel', end)
    btn.addEventListener('pointerout', end)
  }
}
