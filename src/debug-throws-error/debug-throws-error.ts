import { Rule, RuleModule } from '@sketch-hq/sketch-lint-core'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = (): void => {
  throw new Error('Test error message')
}

const ruleModule: RuleModule = {
  rule,
  name: 'debug-throws-error',
  title: _(t`Throw Error`),
  description: _(t`Internal debug rule that always throws a rule error`),
  debug: true,
}

export { ruleModule }
