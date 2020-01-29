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
  if (!Array.isArray(patterns)) return
  const regexes: RegExp[] = []
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    if (typeof pattern === 'string') {
      regexes.push(new RegExp(pattern))
    }
  }
  await utils.iterateCache({
    $layers(node): void {
      const name = utils.nodeToObject<FileFormat.AnyLayer>(node).name
      // Create an array of booleans, with each boolean representing the result
      // of testing the layer's name against each disallowed pattern.
      const results = regexes.map(regex => regex.test(name))
      // If `true` is anywhere in the array it means at least one disallowed
      // pattern was matched
      if (results.includes(true)) {
        utils.report({
          node,
          message: _(t`Unexpected disallowed layer name "${name}"`),
        })
      }
    },
  })
}

const ruleModule: RuleModule = {
  rule,
  name: 'layer-names-pattern-disallowed',
  title: _(t`Disallowed Layer Names`),
  description: _(t`Define a list of disallowed layer names`),
  getOptions(helpers) {
    return [
      helpers.stringArrayOption({
        name: 'patterns',
        title: _(t`Patterns`),
        description: _(
          t`An array of disallowed layer name pattern strings as JavaScript compatible regex`,
        ),
      }),
    ]
  },
}

export { ruleModule }
