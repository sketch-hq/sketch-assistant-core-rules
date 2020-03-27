import { t } from '@lingui/macro'

import { CreateRuleFunction } from '../..'
import { createNamePatternRuleFunction } from '../../rule-helpers'

export const createRule: CreateRuleFunction = (i18n) => {
  return {
    rule: createNamePatternRuleFunction(i18n, ['artboard']),
    name: 'name-pattern-artboards',
    title: i18n._(t`Artboard Name Patterns`),
    description: i18n._(t`Defines allowable and forbidden name patterns for artboard layers`),
    getOptions(helpers) {
      return [
        helpers.stringArrayOption({
          name: 'allowed',
          title: i18n._(t`Allowable Patterns`),
          description: i18n._(
            t`An array of allowed name pattern strings as JavaScript compatible regex`,
          ),
        }),
        helpers.stringArrayOption({
          name: 'forbidden',
          title: i18n._(t`Forbidden Patterns`),
          description: i18n._(
            t`An array of forbidden name pattern strings as JavaScript compatible regex`,
          ),
        }),
      ]
    },
  }
}
