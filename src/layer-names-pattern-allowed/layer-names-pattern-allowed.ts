import {
  Rule,
  RuleModule,
  RuleInvocationContext,
} from '@sketch-hq/sketch-lint-core'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { t } from '@lingui/macro'
import { _ } from '../i18n'

const rule: Rule = async (context: RuleInvocationContext): Promise<void> => {
  const { utils } = context
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
      const name = utils.nodeToObject<FileFormat.AnyLayer>(node).name
      if (!regexes.map(regex => regex.test(name)).includes(true)) {
        utils.report({
          node,
          message: _(
            t`Unexpected layer name "${name}", does not match one of the allowable patterns`,
          ),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'layer-names-pattern-allowed',
  title: _(t`Allowed Layer Names`),
  description: _(t`Define a list of allowable layer names`),
  getOptions(helpers) {
    return [
      helpers.stringArrayOption({
        name: 'patterns',
        title: _(t`Patterns`),
        description: _(
          t`An array of allowed layer name pattern strings as JavaScript compatible regex`,
        ),
      }),
    ]
  },
}

export { ruleModule }
