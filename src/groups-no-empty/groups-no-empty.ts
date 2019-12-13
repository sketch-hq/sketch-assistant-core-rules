import {
  Rule,
  Node,
  RuleModule,
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
      if (group.layers.length === 0) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected empty group',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'groups-no-empty',
  title: 'No empty groups',
  description: 'Enable this rule to disallow empty groups',
}

export { ruleModule }
