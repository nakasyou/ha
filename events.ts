/**
 * For handling events
 * @module
 */

import type { Wave } from './mod.ts'

/**
 * Create a event listener for `pointerdown` event.
 * @example
 * ```ts
 * const wave = ha({})
 * button.addEventListener('pointerdown', waveAsPointerDown(wave))
 * ```
 * @param wave Wave Object
 * @returns A event listener for `pointerdown`
 */
export const waveAsPointerDown = (
  wave: Wave<{
    waveDuration: number
    gooutDuration: number
    color: string
    opacity: number
  }>,
): (evt: PointerEvent) => void =>
(evt) => {
  const target = evt.target as HTMLElement
  const finishWave = wave.do({
    target: evt.target as HTMLElement,
    pos: evt,
  })
  const end = () => {
    finishWave()
    target.removeEventListener('pointerup', end)
    target.removeEventListener('pointerleave', end)
    target.removeEventListener('pointercancel', end)
    target.removeEventListener('pointerout', end)
  }
  target.addEventListener('pointerup', end)
  target.addEventListener('pointerleave', end)
  target.addEventListener('pointercancel', end)
  target.addEventListener('pointerout', end)
}
