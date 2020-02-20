import { Rule, RuleModule } from '@sketch-hq/sketch-lint-core'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = (context): void => {
  context.utils.report({
    message: _(t`Hello world`),
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'debug-i18n',
  title: _(t`Debug Internationalization`),
  description: _(
    t`Internal debug rule that generates a violation with a translated message`,
  ),
  debug: true,
}

export { ruleModule }
