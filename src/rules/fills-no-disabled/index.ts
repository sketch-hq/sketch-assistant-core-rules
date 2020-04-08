import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, Node, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'
import { isCombinedShapeChildLayer } from '../../rule-helpers'

const styleHasDisabledFill = (style: FileFormat.Style): boolean =>
  Array.isArray(style.fills) && style.fills.some((fill) => !fill.isEnabled)

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async $layers(node: Node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (isCombinedShapeChildLayer(node, utils)) return // Ignore layers in combined shapes
        if (!('style' in layer)) return // Narrow type to layers with a `style` prop
        if (!layer.style) return // Narrow type to truthy `style` prop
        if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
        if (styleHasDisabledFill(layer.style)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled fill on layer style`),
          })
        }
      },
      async sharedStyle(node: Node): Promise<void> {
        const sharedStyle = utils.nodeToObject<FileFormat.SharedStyle>(node)
        if (styleHasDisabledFill(sharedStyle.value)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled fill in shared style`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'fills-no-disabled',
    title: i18n._(t`No Disabled Fills`),
    description: i18n._(t`Forbids disabled fill styles throughout the document`),
  }
}
