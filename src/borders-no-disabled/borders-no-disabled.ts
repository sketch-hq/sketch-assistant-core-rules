import {
  Rule,
  RuleModule,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const styleHasDisabledBorder = (style: FileFormat.Style): boolean => {
  if (!Array.isArray(style.borders)) return false
  if (style.borders.length === 0) return false
  return style.borders.map(border => border.isEnabled).includes(false)
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  await utils.iterateCache({
    $layers(node): void {
      const layer = utils.nodeToObject<FileFormat.AnyLayer>(node)
      if (!('style' in layer)) return // Narrow type to layers with a `style` prop
      if (!layer.style) return // Narrow type to truthy `style` prop
      if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
      if (styleHasDisabledBorder(layer.style)) {
        utils.report({
          node,
          message: _(t`Unexpected disabled border on layer style`),
        })
      }
    },
    sharedStyle(node): void {
      const sharedStyle = utils.nodeToObject<FileFormat.SharedStyle>(node)
      if (styleHasDisabledBorder(sharedStyle.value)) {
        utils.report({
          node,
          message: _(t`Unexpected disabled border in shared style`),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'borders-no-disabled',
  title: _(t`No Disabled Borders`),
  description: _(t`Forbids disabled border styles throughout the document`),
}

export { ruleModule }
