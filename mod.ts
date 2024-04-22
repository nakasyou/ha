/**
 * Entry point
 * @module
 */

type NonUndefinedKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

interface Settings {
  /**
   * Target Element
   */
  target?: HTMLElement

  /**
   * Duration (ms)
   */
  duration?: number

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
}

interface Wave<T extends Settings> {
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
  ): Promise<void>
}

export const wave = <T extends Settings>(settings?: T): Wave<T> => ({
  extend<U extends Settings>(extend: U) {
    return wave(
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
const summonWave = ({ target, duration, pos, color }: Required<Settings>): Promise<void> => {
  const rect = target.getBoundingClientRect()
  const style = target.style

  const radius = Math.max(rect.width, rect.height) * 2

  const x = pos.clientX - rect.left
  const y = pos.clientY - rect.top

  const svg =
    `<svg width="${rect.width}" height="${rect.height}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${x}" cy="${y}" r="0" fill="${color}">
      <animate attributeName="r" from="0" to="${radius}" dur="${duration}ms" fill="freeze" />
      <animate attributeName="opacity" from="1" to="0" dur="${duration}ms" fill="freeze" />
    </circle>
  </svg>`
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  const targetCSSProp = `url("${svgUrl}")`

  style.backgroundImage = targetCSSProp +
    (style.backgroundImage ? ',' + style.backgroundImage : '')

  target.dataset.haWaveings = (parseInt(target.dataset.haWaveings ?? '0') + 1)
    .toString()

  return new Promise((resolve) =>
    setTimeout(() => {
      const waveings = parseInt(target.dataset.haWaveings ?? '0') - 1
      target.dataset.haWaveings = waveings.toString()
      target.dataset.haPendings = (target.dataset.haPendings ?? '') + svgUrl +
        ';'

      if (waveings === 0) {
        let nextBackgroundImage = style.backgroundImage
        for (const url of target.dataset.haPendings.split(';')) {
          const regex = new RegExp(`,? ?url\\("${url}"\\),? ?`)

          nextBackgroundImage = nextBackgroundImage.replace(
            regex,
            '',
          )
        }
        style.backgroundImage = nextBackgroundImage
        target.dataset.haPendings = ''
      }

      const next = style.backgroundImage.replace(targetCSSProp, '').replace(
        /^[, ]*/,
        '',
      )
      style.backgroundImage = next

      URL.revokeObjectURL(svgUrl)
      resolve(undefined)
    }, duration)
  )
}
