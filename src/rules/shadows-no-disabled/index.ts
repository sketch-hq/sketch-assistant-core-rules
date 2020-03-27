import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, Node, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

const styleHasDisabledShadow = (style: FileFormat.Style): boolean =>
  Array.isArray(style.shadows) && style.shadows.some((shadow) => !shadow.isEnabled)

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async $layers(node: Node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (!('style' in layer)) return // Narrow type to layers with a `style` prop
        if (!layer.style) return // Narrow type to truthy `style` prop
        if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
        if (styleHasDisabledShadow(layer.style)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled shadow on layer style`),
          })
        }
      },
      async sharedStyle(node: Node): Promise<void> {
        const sharedStyle = utils.nodeToObject<FileFormat.SharedStyle>(node)
        if (styleHasDisabledShadow(sharedStyle.value)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled shadow in shared style`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'shadows-no-disabled',
    title: i18n._(t`No Disabled Shadows`),
    description: i18n._(t`Forbids disabled shadow styles throughout the document`),
  }
}
