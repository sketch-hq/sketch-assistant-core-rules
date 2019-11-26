import {
  Rule,
  RuleModule,
  Node,
  ReportItem,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'

const name = 'layers-no-hidden'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
  const invalid: Node[] = []
  await utils.walk({
    $layers(node): void {
      if ('isVisible' in node && node.isVisible === false) {
        invalid.push(node)
      }
    },
  })
  utils.report(
    invalid.map(
      (node): ReportItem => ({
        message: 'Unexpected hidden layer',
        node,
      }),
    ),
  )
}

const ruleModule: RuleModule = {
  rule,
  name,
  title: 'No hidden layers',
  description: 'Enable this rule to disallow hidden layers from the document',
}

export { ruleModule }
