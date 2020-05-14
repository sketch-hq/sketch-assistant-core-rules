import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    for (const node of utils.iterators.group) {
      const group = utils.nodeToObject<FileFormat.Group>(node)
      if (group.layers.length === 0) {
        utils.report({
          node,
          message: i18n._(t`This group is empty`),
        })
      }
    }
  }

  return {
    rule,
    name: 'groups-no-empty',
    title: i18n._(t`Groups should not be empty`),
    description: i18n._(t`Remove empty groups to avoid document organization or usability issues.`),
  }
}
