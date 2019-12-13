import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const styleHasDisabledBorder = (style: FileFormat.Style): boolean => {
  if (!Array.isArray(style.borders)) return false
  if (style.borders.length === 0) return false
  return style.borders.map(border => border.isEnabled).includes(false)
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  await utils.walk({
    $layers(node): void {
      const layer = utils.nodeToObject(node)
      if (!('style' in layer)) return // Narrow type to layers with a `style` prop
      if (!layer.style) return // Narrow type to truthy `style` prop
      if (typeof layer.sharedStyleID === 'string') return // Ignore layers using a shared style
      if (styleHasDisabledBorder(layer.style)) {
        invalid.push(node)
      }
    },
    sharedStyle(node): void {
      const sharedStyle = utils.nodeToObject<FileFormat.SharedStyle>(node)
      if (styleHasDisabledBorder(sharedStyle.value)) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected disabled border',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'borders-no-disabled',
  title: 'No disabled borders',
  description: 'Enable this rule to disallow disabled borders',
}

export { ruleModule }
