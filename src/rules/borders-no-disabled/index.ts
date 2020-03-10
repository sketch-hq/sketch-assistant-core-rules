import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, Node } from '@sketch-hq/sketch-assistant-utils'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

const styleHasDisabledBorder = (style: FileFormat.Style): boolean => {
  if (!Array.isArray(style.borders)) return false
  if (style.borders.length === 0) return false
  return style.borders.map(border => border.isEnabled).includes(false)
}

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async $layers(node: Node): Promise<void> {
        const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
        if (!('style' in layer)) return // Narrow type to layers with a `style` prop
        if (!layer.style) return // Narrow type to truthy `style` prop
        if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
        if (styleHasDisabledBorder(layer.style)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled border on layer style`),
          })
        }
      },
      async sharedStyle(node: Node): Promise<void> {
        const sharedStyle = utils.nodeToObject<FileFormat.SharedStyle>(node)
        if (styleHasDisabledBorder(sharedStyle.value)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disabled border in shared style`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'borders-no-disabled',
    title: i18n._(t`No Disabled Borders`),
    description: i18n._(t`Forbids disabled border styles throughout the document`),
  }
}
