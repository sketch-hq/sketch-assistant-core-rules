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

  const sharedStyles: Node<FileFormat.SharedStyle>[] = []
  const usages: Set<string> = new Set()

  await utils.walk({
    sharedStyle(node) {
      sharedStyles.push(node as Node<FileFormat.SharedStyle>)
    },
    $layers(node) {
      const obj = utils.nodeToObject(node)
      if ('sharedStyleID' in obj && typeof obj.sharedStyleID === 'string') {
        usages.add(obj.sharedStyleID)
      }
    },
  })

  const invalid: Node[] = sharedStyles.filter(
    node => !usages.has(node.do_objectID),
  )

  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected unused shared style',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'styles-no-unused',
  title: 'No unused styles',
  description: 'Enable this rule to disallow unused shared styles',
}

export { ruleModule }
