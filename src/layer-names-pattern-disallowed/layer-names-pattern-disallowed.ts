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
  const patterns = utils.getOption('patterns')
  if (!Array.isArray(patterns) || patterns.length === 0) return
  const regexes: RegExp[] = []
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    if (typeof pattern === 'string') {
      regexes.push(new RegExp(pattern))
    }
  }
  await utils.walk({
    $layers(node): void {
      // Create an array of booleans, with each boolean representing the result
      // of testing the layer's name against each disallowed pattern.
      const results = regexes.map(regex =>
        regex.test(utils.nodeToObject<FileFormat.AnyLayer>(node).name),
      )
      // If `true` is anywhere in the array it means at least one disallowed
      // pattern was matched
      if (results.includes(true)) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: `Unexpected layer name '${'name' in node ? node.name : ''}'`,
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name: 'layer-names-pattern-disallowed',
  title: 'Disallowed layer names',
  description: 'Enable this rule to disallow layer naming patterns',
  getOptions(helpers) {
    return [
      helpers.stringArrayOption({
        name: 'patterns',
        title: 'Disallowed patterns',
        description: 'An array of disallowed layer name patterns as regex',
      }),
    ]
  },
}

export { ruleModule }
