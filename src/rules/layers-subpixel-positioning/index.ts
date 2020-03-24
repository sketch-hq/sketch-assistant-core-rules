import { t } from '@lingui/macro'
import {
  RuleContext,
  RuleFunction,
  PointerValue,
  FileFormat,
} from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

const INCREMENTS: { [key: string]: string[] } = {
  '@1x': ['0.00'],
  '@2x': ['0.00', '0.50'],
  '@3x': ['0.00', '0.33', '0.67'],
}

const isRotated = (value: PointerValue) =>
  typeof value === 'object' && 'rotation' in value && value.rotation !== 0

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    // Type safe code to extract option from config
    const scaleFactors = utils.getOption('scaleFactors')
    if (!Array.isArray(scaleFactors) || scaleFactors.length === 0) return
    let validIncrements: string[] = []
    for (let i = 0; i < scaleFactors.length; i++) {
      const scaleFactor = scaleFactors[i]
      if (typeof scaleFactor === 'string') {
        const increments = INCREMENTS[scaleFactor]
        if (Array.isArray(increments)) {
          validIncrements = [...validIncrements, ...increments]
        }
      }
    }
    await utils.iterateCache({
      async $layers(node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (!('frame' in layer)) return // Narrow type to layers with a `frame` prop
        // If the current layer or any of its parents have rotation return early
        let hasRotation = isRotated(node)
        utils.iterateParents(node, parent => {
          if (isRotated(parent)) {
            hasRotation = true
          }
        })
        if (hasRotation) return
        const { x, y } = layer.frame
        const xValid = validIncrements.includes(Math.abs(x % 1).toFixed(2))
        const yValid = validIncrements.includes(Math.abs(y % 1).toFixed(2))
        if (!xValid || !yValid) {
          utils.report({
            node,
            message: i18n._(t`Unexpected subpixel positioning (${x},${y})`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'layers-subpixel-positioning',
    title: i18n._(t`Layer Subpixel Positioning`),
    description: i18n._(t`Enforce layer positioning with respect to subpixels`),
    getOptions(helpers) {
      return [
        helpers.stringArrayOption({
          name: 'scaleFactors',
          title: i18n._(t`Scale Factors`),
          description: i18n._(
            t`Array of supported scale factors in the document. Accepts elements with values "@1x", "@2x" and "@3x" only, which map to allowing whole pixel positions, 0.5 increments and 0.33 increments respectively`,
          ),
          minLength: 1,
          maxLength: 3,
          pattern: '^@[1-3]x$',
        }),
      ]
    },
  }
}
