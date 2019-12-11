import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

const name = 'layer-names-pattern-allowed'

const nodeToObj = <T extends FileFormat.AnyObject>(node: Node) => {
  const { $pointer, ...obj } = node
  return obj as T
}

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  const patterns = utils.getOption('patterns')
  if (!Array.isArray(patterns) || patterns.length === 0) return
  await utils.walk({
    $layers(node): void {
      if (
        !patterns
          .map(pattern =>
            new RegExp(pattern).test(nodeToObj<FileFormat.AnyLayer>(node).name),
          )
          .includes(true)
      ) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: `Unexpected layer name "${'name' in node ? node.name : ''}"`,
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name,
  title: 'Allowed layer names',
  description: 'Enable this rule to enforce a naming pattern for layers',
  getOptions(helpers) {
    return [
      helpers.stringArrayOption({
        name: 'patterns',
        title: 'Allowed patterns',
        description: 'An array of allowed layer name patterns as regex',
      }),
    ]
  },
}

export { ruleModule }
