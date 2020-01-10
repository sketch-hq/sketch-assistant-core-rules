import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  await utils.walk({
    group(node): void {
      const group = utils.nodeToObject<FileFormat.Group>(node)
      const usesSharedStyle = typeof group.sharedStyleID === 'string'
      const isStyled =
        group.style && group.style.shadows && group.style.shadows.length > 0
      const hasOneChild = group.layers.length === 1
      const onlyChildIsGroup = hasOneChild && group.layers[0]._class === 'group'
      if (!usesSharedStyle && !isStyled && hasOneChild && onlyChildIsGroup) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected redundant group',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'groups-no-redundant',
  title: 'No redundant groups',
  description: 'Enable this rule to disallow redundant groups',
}

export { ruleModule }
