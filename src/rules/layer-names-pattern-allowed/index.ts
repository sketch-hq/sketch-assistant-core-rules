import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

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
        if (!regexes.map(regex => regex.test(name)).includes(true)) {
          utils.report({
            node,
            message: i18n._(
              t`Unexpected layer name "${name}", does not match one of the allowable patterns`,
            ),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'layer-names-pattern-allowed',
    title: i18n._(t`Allowed Layer Names`),
    description: i18n._(t`Define a list of allowable layer names`),
    getOptions(helpers) {
      return [
        helpers.stringArrayOption({
          name: 'patterns',
          title: i18n._(t`Patterns`),
          description: i18n._(
            t`An array of allowed layer name pattern strings as JavaScript compatible regex`,
          ),
        }),
      ]
    },
  }
}
