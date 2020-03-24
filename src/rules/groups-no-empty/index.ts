import { t } from '@lingui/macro'
import { RuleContext, RuleFunction, FileFormat } from '@sketch-hq/sketch-assistant-types'

import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = (i18n) => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async group(node): Promise<void> {
        const group = utils.nodeToObject<FileFormat.Group>(node)
        if (group.layers.length === 0) {
          utils.report({
            node,
            message: i18n._(t`Unexpected empty group`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'groups-no-empty',
    title: i18n._(t`No Empty Groups`),
    description: i18n._(t`Disallow empty groups, i.e. with no child layers`),
  }
}
