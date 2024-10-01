/**
 * @example
 * ```ts
 * import { ha } from '@ns/ha'
 *
 * const close = ha({
 *   // ...
 * }).do({})
 * setTimeout(() => close(), 500)
 * ```
 * @module
 */

/**
 * Pick non undefined keys
 */
type NonUndefinedKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

/**
 * Settings
 */
export interface Settings {
  /**
   * Target Element
   */
  target?: HTMLElement

  /**
   * Duration for Wave (ms)
   */
  waveDuration?: number

  /**
   * Duration for going out (ms)
   */
  gooutDuration?: number

  /**
   * Start position
   */
  pos?: {
    clientX: number
    clientY: number
  }

  /**
   * Color
   */
  color?: string

  /**
   * First opacity
   */
  opacity?: number
}

type EndWave = () => void

/**
 * Wave interface
 */
export interface Wave<T extends Settings> {
  /**
   * Extends settings
   * @param extend settings to extend
   */
  extend<U extends Settings>(extend: U): Wave<Omit<T, keyof U> & U>

  /**
   * summon wave
   * @param settings
   */
  do(
    settings:
      & {
        [K in Exclude<keyof Settings, NonUndefinedKeys<T> | undefined>]:
          Required<Settings>[K]
      }
      & {
        [K in keyof Settings]?: Settings[K]
      },
  ): EndWave
}

/**
 * Create waveo
 */
export const ha = <T extends Settings>(settings?: T): Wave<T> => ({
  extend<U extends Settings>(extend: U) {
    return ha(
      Object.assign({}, settings ?? {}, extend) as Omit<T, keyof U> & U,
    )
  },
  do(extend) {
    return summonWave(Object.assign({}, settings, extend) as Required<Settings>)
  },
})

/**
 * Summon wave
 * @internal
 */
const summonWave = (
  { target, waveDuration, gooutDuration, pos, color, opacity }: Required<
    Settings
  >,
): EndWave => {
  const rect = target.getBoundingClientRect()
  const style = target.style

  const radius = Math.max(rect.width, rect.height) * 2

  const x = pos.clientX - rect.left
  const y = pos.clientY - rect.top

  const svg =
    `<svg width="${rect.width}" height="${rect.height}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${x}" cy="${y}" opacity="${opacity}" r="0" fill="${color}">
      <animate attributeName="r" from="0" to="${radius}" dur="${waveDuration}ms" fill="freeze" />
    </circle>
  </svg>`

  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  const targetCSSProp = `url("${svgUrl}")`

  style.backgroundImage = targetCSSProp +
    (style.backgroundImage ? `,${style.backgroundImage}` : '')

  const waveStartTime = Date.now()

  return async () => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(null), waveDuration - Date.now() + waveStartTime)
    })
    const endSVG =
      `<svg width="${rect.width}" height="${rect.height}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${x}" cy="${y}" r="1000" fill="${color}">
        <animate attributeName="opacity" from="${opacity}" to="0" dur="${gooutDuration}ms" fill="freeze" />
      </circle>
    </svg>`
    const endSVGUrl = URL.createObjectURL(
      new Blob([endSVG], { type: 'image/svg+xml' }),
    )
    style.backgroundImage = `url("${endSVGUrl}")` +
      (style.backgroundImage ? `,${style.backgroundImage}` : '')

    setTimeout(() => {
      style.backgroundImage = style.backgroundImage.split(',').filter((v) =>
        !v.includes(svgUrl)
      ).join(',')
      URL.revokeObjectURL(svgUrl)
    }, 10)
    setTimeout(() => {
      style.backgroundImage = style.backgroundImage.split(',').filter((v) =>
        !v.includes(endSVGUrl)
      ).join(',')
      URL.revokeObjectURL(endSVGUrl)
    }, gooutDuration)
  }
}
