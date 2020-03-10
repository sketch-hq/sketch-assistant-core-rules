import { t } from '@lingui/macro'
import { RuleContext, RuleFunction } from '@sketch-hq/sketch-assistant-utils'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
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
      async $layers(node): Promise<void> {
        const name = utils.nodeToObject<FileFormat.AnyLayer>(node).name
        // Create an array of booleans, with each boolean representing the result
        // of testing the layer's name against each disallowed pattern.
        const results = regexes.map(regex => regex.test(name))
        // If `true` is anywhere in the array it means at least one disallowed
        // pattern was matched
        if (results.includes(true)) {
          utils.report({
            node,
            message: i18n._(t`Unexpected disallowed layer name "${name}"`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'layer-names-pattern-disallowed',
    title: i18n._(t`Disallowed Layer Names`),
    description: i18n._(t`Define a list of disallowed layer names`),
    getOptions(helpers) {
      return [
        helpers.stringArrayOption({
          name: 'patterns',
          title: i18n._(t`Patterns`),
          description: i18n._(
            t`An array of disallowed layer name pattern strings as JavaScript compatible regex`,
          ),
        }),
      ]
    },
  }
}
