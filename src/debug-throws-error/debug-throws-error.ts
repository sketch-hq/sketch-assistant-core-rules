import { Rule, RuleModule } from '@sketch-hq/sketch-lint-core'

const rule: Rule = (): void => {
  throw new Error('Test error message')
}

const ruleModule: RuleModule = {
  rule,
  name: 'debug-throws-error',
  title: 'Throw error',
  description: 'Enable this rule to trigger an error',
  debug: true,
}

export { ruleModule }
