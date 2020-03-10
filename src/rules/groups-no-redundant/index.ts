import { t } from '@lingui/macro'
import { RuleContext, RuleFunction } from '@sketch-hq/sketch-assistant-utils'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

import { CreateRuleFunction } from '../..'

export const createRule: CreateRuleFunction = i18n => {
  const rule: RuleFunction = async (context: RuleContext): Promise<void> => {
    const { utils } = context
    await utils.iterateCache({
      async group(node): Promise<void> {
        const group = utils.nodeToObject<FileFormat.Group>(node)
        const usesSharedStyle = typeof group.sharedStyleID === 'string'
        const isStyled = group.style && group.style.shadows && group.style.shadows.length > 0
        const hasOneChild = group.layers.length === 1
        const onlyChildIsGroup = hasOneChild && group.layers[0]._class === 'group'
        if (!usesSharedStyle && !isStyled && hasOneChild && onlyChildIsGroup) {
          utils.report({
            node,
            message: i18n._(t`Unexpected redundant group`),
          })
        }
      },
    })
  }

  return {
    rule,
    name: 'groups-no-redundant',
    title: i18n._(t`No Redundant Groups`),
    description: i18n._(t`Disallows unstyled groups with only one child which is also a group`),
  }
}
